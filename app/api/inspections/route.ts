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
        return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Save to IQC DB
        const inspection = await prisma.inspectionResult.create({
            data: body
        });

        // 2. Update Warehouse DB
        // We need to find the invoice record in warehouse DB.
        // Assuming 'lotIqc' maps to 'id' or we use 'invoice' and 'partNo'.
        // The previous sync logic used `inv.id` to generate `lotNo` as `LOT-{id}`.
        // So if `lotIqc` is `LOT-123`, the ID is 123.

        let warehouseId = null;
        if (body.lotIqc && body.lotIqc.startsWith('LOT-')) {
            warehouseId = body.lotIqc.replace('LOT-', '');
        }

        if (warehouseId) {
            await warehouseDb.query(
                `UPDATE invoices SET iqcstatus = $1 WHERE id = $2`,
                [body.judgment, warehouseId]
            );
        } else {
            // Fallback: try to match by invoice and partNo if ID logic fails
            await warehouseDb.query(
                `UPDATE invoices SET iqcstatus = $1 WHERE invoice = $2 AND "partNo" = $3`,
                [body.judgment, body.invoiceNo, body.partNo]
            );
        }

        return NextResponse.json(inspection);
    } catch (error) {
        console.error("Inspection submit error:", error);
        return NextResponse.json({ error: 'Failed to create inspection record' }, { status: 500 });
    }
}
