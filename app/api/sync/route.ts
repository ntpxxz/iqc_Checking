import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { warehouseDb } from '@/lib/warehouseDb';

export async function POST() {
    try {
        // 1. Fetch pending invoices from Warehouse DB
        // Assuming 'Pending' is the status for new items. Adjust if it's NULL or empty.
        const { rows: newInvoices } = await warehouseDb.query(
            `SELECT * FROM invoices WHERE iqcstatus = 'Pending' OR iqcstatus IS NULL ORDER BY id DESC`
        );

        console.log(`Found ${newInvoices.length} pending invoices in warehouse DB`);

        const createdTasks = [];
        const skippedTasks = [];
        const errors = [];

        for (const inv of newInvoices) {
            try {
                // 2. Check if task already exists to avoid duplicates
                // We can use invoice number + part number as a unique key
                const existingTask = await prisma.task.findFirst({
                    where: {
                        invoice: inv.invoice,
                        part: inv.partNo
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

                // 4. Create new Task in IQC DB
                const newTask = await prisma.task.create({
                    data: {
                        receivedAt: inv.receivedDate || new Date().toISOString().split('T')[0],
                        inspectionType: 'New Part', // Default
                        invoice: inv.invoice,
                        lotNo: `LOT-${inv.id}`, // Generate a lot number based on ID
                        model: inv.model || '-', // Use model from invoice if available
                        partName: inv.partName || 'Unknown',
                        part: inv.partNo,
                        rev: inv.rev || '-', // Use rev from invoice if available
                        vendor: inv.vendor || 'Unknown',
                        qty: inv.qty || 0,
                        receiver: inv.recordedBy || 'System',
                        issue: '-',
                        timestamp: inv.timestamp || new Date().toISOString(),
                        iqcStatus: 'Waiting IQ',
                        grn: inv.grn || '-', // Use GRN from invoice if available
                        mfgDate: inv.mfgDate || '-',
                        location: 'Receiving',
                        warehouse: inv.warehouse || 'Main',
                        samplingType: 'Normal',
                        totalSampling: 0,
                        aql: '0.65',
                        urgent: false,
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

        // 5. Cleanup: Remove tasks from IQC DB that are no longer 'Pending' in Warehouse DB
        // Fetch all local tasks
        const localTasks = await prisma.task.findMany();
        let removedCount = 0;

        for (const task of localTasks) {
            // Check status in warehouse
            const { rows: whStatus } = await warehouseDb.query(
                `SELECT iqcstatus FROM invoices WHERE invoice = $1 AND "partNo" = $2`,
                [task.invoice, task.part]
            );

            if (whStatus.length > 0) {
                const status = whStatus[0].iqcstatus;
                // If status is not Pending/NULL, it means it's already processed elsewhere
                if (status && status !== 'Pending') {
                    await prisma.task.delete({ where: { id: task.id } });
                    removedCount++;
                    console.log(`Task ${task.invoice} removed during cleanup (Warehouse status: ${status})`);
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
