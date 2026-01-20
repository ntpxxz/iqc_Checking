import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { warehouseDb } from '@/lib/warehouseDb';

export async function POST() {
    try {
        // 1. Fetch pending invoices from Warehouse DB
        // Assuming 'Pending' is the status for new items. Adjust if it's NULL or empty.
        const { rows: newInvoices } = await warehouseDb.query(
            `SELECT * FROM invoices WHERE iqcstatus = 'Pending' OR iqcstatus IS NULL`
        );

        const createdTasks = [];

        for (const inv of newInvoices) {
            // 2. Check if task already exists to avoid duplicates
            // We can use invoice number + part number as a unique key, or the warehouse ID if we store it.
            // For now, let's assume invoice + part is unique enough, or we should add a 'warehouseId' field to Task.
            // Let's check by invoice and part for now.
            const existingTask = await prisma.task.findFirst({
                where: {
                    invoice: inv.invoice,
                    part: inv.partNo
                }
            });

            if (!existingTask) {
                // 3. Create new Task in IQC DB
                const newTask = await prisma.task.create({
                    data: {
                        receivedAt: inv.receivedDate || new Date().toISOString().split('T')[0],
                        inspectionType: 'New Part', // Default
                        invoice: inv.invoice,
                        lotNo: `LOT-${inv.id}`, // Generate a lot number based on ID
                        model: '-', // Not in invoice
                        partName: inv.partName,
                        part: inv.partNo,
                        rev: '-', // Not in invoice
                        vendor: inv.vendor,
                        qty: inv.qty,
                        receiver: inv.recordedBy,
                        issue: '-',
                        timestamp: inv.timestamp || new Date().toISOString(),
                        iqcStatus: 'Waiting IQ',
                        grn: '-', // Not in invoice
                        mfgDate: '-',
                        location: 'Receiving',
                        warehouse: inv.warehouse || 'Main',
                        samplingType: 'Normal',
                        totalSampling: 0,
                        aql: '0.65',
                        urgent: false,
                    }
                });
                createdTasks.push(newTask);
            }
        }

        return NextResponse.json({
            message: 'Sync complete',
            syncedCount: createdTasks.length,
            tasks: createdTasks
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Failed to sync with warehouse' }, { status: 500 });
    }
}
