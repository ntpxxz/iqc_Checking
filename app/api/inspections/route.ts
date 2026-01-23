import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { warehouseDb } from '@/lib/warehouseDb';

export async function GET() {
    try {
        const inspections = await prisma.inspectionResult.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(inspections);
    } catch (error) {
        console.error('Failed to fetch inspections:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inspections', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { taskId, ...inspectionData } = body;

        // Validate required fields
        if (!body.lotIqc || !body.partNo || !body.judgment) {
            return NextResponse.json(
                { error: 'Missing required fields: lotIqc, partNo, and judgment are required' },
                { status: 400 }
            );
        }

        // 1. Save to IQC DB (InspectionResult)
        const inspection = await prisma.inspectionResult.create({
            data: inspectionData
        });

        // 2. Delete from Pending Tasks
        if (taskId) {
            try {
                await prisma.task.delete({
                    where: { id: taskId }
                });
                console.log(`Task ${taskId} removed from pending queue`);
            } catch (deleteError) {
                console.warn(`Could not delete task ${taskId}:`, deleteError);
                // Continue anyway, we don't want to fail the whole request
            }
        }

        // 3. Update Warehouse DB
        // Map IQC judgment to Warehouse status
        const warehouseStatus = body.judgment === 'PASS' ? 'PASSED' : 'REJECTED';

        let warehouseId = null;
        if (body.lotIqc && body.lotIqc.startsWith('LOT-')) {
            warehouseId = body.lotIqc.replace('LOT-', '');
        }

        try {
            if (warehouseId) {
                console.log(`Updating warehouse ID ${warehouseId} to status ${warehouseStatus}`);
                const updateResult = await warehouseDb.query(
                    `UPDATE invoices SET iqcstatus = $1 WHERE id = $2`,
                    [warehouseStatus, warehouseId]
                );

                if (updateResult.rowCount === 0) {
                    console.warn(`No warehouse record found with ID ${warehouseId}, trying fallback...`);
                    await warehouseDb.query(
                        `UPDATE invoices SET iqcstatus = $1 WHERE invoice = $2 AND "partNo" = $3`,
                        [warehouseStatus, body.invoiceNo, body.partNo]
                    );
                }
            } else {
                await warehouseDb.query(
                    `UPDATE invoices SET iqcstatus = $1 WHERE invoice = $2 AND "partNo" = $3`,
                    [warehouseStatus, body.invoiceNo, body.partNo]
                );
            }
        } catch (warehouseError) {
            console.error("Warehouse DB update error:", warehouseError);
        }

        return NextResponse.json(inspection, { status: 201 });
    } catch (error) {
        console.error("Inspection submit error:", error);
        return NextResponse.json(
            { error: 'Failed to create inspection record', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
