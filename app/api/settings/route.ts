import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.settings.findFirst();
        return NextResponse.json(settings || {});
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const settings = await prisma.settings.upsert({
            where: { id: body.id || 'default' }, // Assuming single settings record strategy or ID passed
            update: body,
            create: body,
        });
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Failed to update settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
