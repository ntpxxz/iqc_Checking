import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { warehouseDb } from '@/lib/warehouseDb';

export async function POST() {
    try {
        // 1. Fetch pending invoices from Warehouse DB
        const { rows: newInvoices } = await warehouseDb.query(
            `SELECT * FROM invoices WHERE iqcstatus = 'Pending' OR iqcstatus IS NULL ORDER BY id DESC`
        );

        console.log(`Found ${newInvoices.length} pending invoices in warehouse DB`);

        const createdTasks = [];
        const skippedTasks = [];
        const errors = [];

        for (const inv of newInvoices) {
            try {
                // 2. Check if inbound task already exists
                const existingTask = await prisma.inboundTask.findFirst({
                    where: {
                        invoiceNo: inv.invoice,
                        partNo: inv.partNo,
                        vendor: inv.vendor || 'Unknown'
                    }
                });

                if (existingTask) {
                    skippedTasks.push({
                        invoice: inv.invoice,
                        part: inv.partNo,
                        reason: 'Already exists'
                    });
                    continue;
                }

                // 3. Validate required fields
                if (!inv.invoice || !inv.partNo) {
                    errors.push({
                        invoice: inv.invoice || 'N/A',
                        part: inv.partNo || 'N/A',
                        error: 'Missing required fields'
                    });
                    continue;
                }

                // 4. Create or Get Part
                let part = await prisma.part.findUnique({
                    where: { partNo: inv.partNo }
                });

                if (!part) {
                    part = await prisma.part.create({
                        data: {
                            partNo: inv.partNo,
                            name: inv.partName || 'Unknown',
                            unit: 'PCS'
                        }
                    });
                }

                // 5. Create new InboundTask in IQC DB
                const newTask = await prisma.inboundTask.create({
                    data: {
                        status: 'IQC_WAITING',
                        invoiceNo: inv.invoice,
                        poNo: inv.po,
                        vendor: inv.vendor || 'Unknown',
                        partId: part.id,
                        partNo: inv.partNo,
                        partName: inv.partName,
                        lotNo: `LOT-${inv.id}`,
                        planQty: Number(inv.qty) || 0,
                        receivedBy: inv.recordedBy || 'System',
                        receivedAt: inv.receivedDate ? new Date(inv.receivedDate) : new Date(),
                    }
                });
                createdTasks.push(newTask);
            } catch (taskError) {
                console.error(`Error processing invoice ${inv.invoice}:`, taskError);
                errors.push({
                    invoice: inv.invoice,
                    part: inv.partNo,
                    error: taskError instanceof Error ? taskError.message : 'Unknown error'
                });
            }
        }

        // 6. Cleanup: Remove tasks from IQC DB that are no longer 'Pending' in Warehouse DB
        const localTasks = await prisma.inboundTask.findMany({
            where: {
                status: {
                    in: ['PENDING', 'IQC_WAITING']
                }
            }
        });
        let removedCount = 0;

        for (const task of localTasks) {
            // Check status in warehouse
            const { rows: whStatus } = await warehouseDb.query(
                `SELECT iqcstatus FROM invoices WHERE invoice = $1 AND "partNo" = $2`,
                [task.invoiceNo, task.partNo]
            );

            if (whStatus.length > 0) {
                const status = whStatus[0].iqcstatus;
                // If status is not Pending/NULL, it means it's already processed elsewhere
                if (status && status !== 'Pending' && status !== 'Pending IQC') {
                    await prisma.inboundTask.delete({ where: { id: task.id } });
                    removedCount++;
                    console.log(`Task ${task.invoiceNo} removed during cleanup (Warehouse status: ${status})`);
                }
            }
        }

        console.log(`Sync complete: ${createdTasks.length} created, ${skippedTasks.length} skipped, ${removedCount} removed, ${errors.length} errors`);

        return NextResponse.json({
            message: 'Sync complete',
            syncedCount: createdTasks.length,
            skippedCount: skippedTasks.length,
            removedCount: removedCount,
            errorCount: errors.length,
            tasks: createdTasks,
            skipped: skippedTasks,
            errors: errors
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            {
                error: 'Failed to sync with warehouse',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
