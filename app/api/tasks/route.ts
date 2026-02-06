import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch inbound tasks for IQC inspection dashboard
        const tasks = await prisma.inboundTask.findMany({
            where: {
                status: {
                    in: ['IQC_WAITING']
                }
            },
            include: {
                part: true
            },
            orderBy: { createdAt: 'desc' },
            take: 500
        });

        // Map to frontend expected format
        const mappedTasks = tasks.map((task) => ({
            id: task.id,
            invoice: task.invoiceNo,
            part: task.partNo,
            partName: task.partName || task.part?.name || 'Unknown Part',
            vendor: task.vendor,
            qty: task.planQty,
            iqcStatus: task.status,
            receiver: task.receivedBy || 'System',
            samplingType: task.samplingType || 'Normal',
            aql: task.aql || '0.65',
            totalSampling: task.totalSampling,
            tagNo: task.tagNo,
            poNo: task.poNo,
            lotNo: task.lotNo,
            createdAt: task.createdAt,
            receivedAt: task.receivedAt,
        }));

        return NextResponse.json(mappedTasks);
    } catch (error) {
        console.error('Failed to fetch inbound tasks:', error);
        return NextResponse.json([], {
            status: 500,
            statusText: 'Database Connection Error'
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.invoiceNo || !body.partNo || !body.vendor) {
            return NextResponse.json(
                { error: 'Missing required fields: invoiceNo, partNo, and vendor are required' },
                { status: 400 }
            );
        }

        const task = await prisma.inboundTask.create({
            data: {
                invoiceNo: body.invoiceNo,
                poNo: body.poNo,
                vendor: body.vendor,
                partNo: body.partNo,
                partName: body.partName,
                planQty: Number(body.planQty || 0),
                status: body.status || 'PENDING',
                lotNo: body.lotNo,
                rev: body.rev,
                receivedBy: body.receivedBy,
                receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
            }
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('Failed to create inbound task:', error);
        return NextResponse.json(
            { error: 'Failed to create task', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        await prisma.inboundTask.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Failed to delete task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
