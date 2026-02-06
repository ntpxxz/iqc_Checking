import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { warehouseDb } from '@/lib/warehouseDb';

export async function GET() {
    try {
        const inspections = await prisma.inspectionResult.findMany({
            include: {
                inboundTask: {
                    include: {
                        part: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map to legacy InspectionRecord format for frontend
        const mappedInspections = inspections.map((ins) => ({
            id: ins.id,
            date: ins.createdAt.toLocaleDateString('en-GB'),
            time: ins.createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            lotIqc: ins.inboundTask?.lotNo || 'N/A',
            invoice: ins.inboundTask?.invoiceNo || 'N/A',
            partNo: ins.inboundTask?.partNo || 'N/A',
            partName: ins.inboundTask?.partName || ins.inboundTask?.part?.name || 'N/A',
            supplier: ins.inboundTask?.vendor || 'N/A',
            judgment: ins.judgment,
            status: ins.judgment === 'PASS' ? 'PASSED' : 'REJECTED',
            qty: (ins.passedQty || 0) + (ins.failedQty || 0),
            remark: ins.remark || '',
            inspector: ins.inspector || 'System',
            createdAt: ins.createdAt.toISOString()
        }));

        return NextResponse.json(mappedInspections);
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
        if (!body.partNo || !body.judgment) {
            return NextResponse.json(
                { error: 'Missing required fields: partNo and judgment are required' },
                { status: 400 }
            );
        }

        // 1. Save to IQC DB (InspectionResult)
        const inspection = await prisma.inspectionResult.create({
            data: {
                inboundTaskId: taskId,
                passedQty: body.judgment === 'PASS' ? Number(body.qty || 0) : 0,
                failedQty: body.judgment === 'FAIL' ? Number(body.qty || 0) : 0,
                judgment: body.judgment,
                remark: body.remark || '',
                inspector: body.inspector || 'System',
                defectReason: body.judgment === 'FAIL' ? body.defectReason || body.remark : null
            }
        });

        // 2. Update InboundTask Status
        if (taskId) {
            try {
                await prisma.inboundTask.update({
                    where: { id: taskId },
                    data: {
                        status: body.judgment === 'PASS' ? 'IQC_PASSED_WAITING_STOCK' : 'REJECTED',
                        finishedAt: new Date(),
                        actualQty: Number(body.qty || 0)
                    }
                });
                console.log(`InboundTask ${taskId} marked as ${body.judgment === 'PASS' ? 'IQC_PASSED_WAITING_STOCK' : 'REJECTED'}`);
            } catch (updateError) {
                console.warn(`Could not update task ${taskId} status:`, updateError);
            }
        }

        // 3. Update Warehouse DB
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

        // 4. Notify Mobile App (Warehouse) - Alert IP:3065
        if (body.judgment === 'PASS') {
            try {
                // Determine target IP from ENV or default
                const MOBILE_APP_URL = process.env.K_MOBILE_API || 'http://192.168.101.225:3065';

                console.log(`Sending alert to Mobile App at ${MOBILE_APP_URL}...`);

                // Construct the payload for the mobile app
                const alertPayload = {
                    type: 'IQC_PASSED',
                    tasks: [{
                        taskId: taskId,
                        invoiceNo: body.invoiceNo,
                        partNo: body.partNo,
                        qty: Number(body.qty || 0),
                        lotNo: body.lotIqc || 'N/A',
                        status: 'WAITING_PUTAWAY',
                        timestamp: new Date().toISOString()
                    }]
                };

                // Fire and forget (don't block response) - or await if critical
                // Use /api/notifications as it handles persistence
                const notifyResponse = await fetch(`${MOBILE_APP_URL}/api/notifications`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'IQC_PASSED',
                        title: 'IQC Passed Check',
                        message: `Part ${body.partNo} (${body.qty} pcs) passed checks. Ready for putaway.`,
                        data: {
                            taskId: taskId,
                            invoiceNo: body.invoiceNo,
                            partNo: body.partNo,
                            qty: Number(body.qty || 0),
                            lotNo: body.lotIqc || 'N/A',
                            status: 'WAITING_PUTAWAY',
                            timestamp: new Date().toISOString()
                        }
                    })
                });

                if (!notifyResponse.ok) {
                    console.warn(`Mobile App notification failed: ${notifyResponse.status} ${notifyResponse.statusText}`);
                } else {
                    console.log('Mobile App notified successfully');
                }
            } catch (notifyError) {
                console.error("Mobile App notification error:", notifyError);
                // Don't fail the request just because notification failed
            }
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
