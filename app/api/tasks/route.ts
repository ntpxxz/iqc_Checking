import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.invoice || !body.part) {
            return NextResponse.json(
                { error: 'Missing required fields: invoice and part are required' },
                { status: 400 }
            );
        }

        const task = await prisma.task.create({
            data: body
        });
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('Failed to create task:', error);
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

        await prisma.task.delete({
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
