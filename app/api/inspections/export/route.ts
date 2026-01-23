import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { columns, data } = body;

        // Use data provided by client (which handles selection and filtering)
        const exportData = data || [];

        // 3. Generate CSV
        const header = columns.map((col: any) => col.label).join(',');
        const rows = exportData.map((item: any) => {
            return columns.map((col: any) => {
                const val = item[col.key] || '';
                // Escape commas and quotes
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',');
        });

        const csv = [header, ...rows].join('\n');

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=inspections_${new Date().toISOString().split('T')[0]}.csv`
            }
        });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
    }
}
