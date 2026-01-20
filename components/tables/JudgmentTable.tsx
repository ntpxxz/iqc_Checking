'use client';
import React from 'react';
import { ArrowUpDown, Gavel } from 'lucide-react';
import { JudgmentResult } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface JudgmentTableProps {
    results: JudgmentResult[];
    onSort: (key: string) => void;
}

export const JudgmentTable: React.FC<JudgmentTableProps> = ({ results, onSort }) => {
    if (results.length === 0) {
        return <EmptyState message="No Judgments Found" subMessage="Try adjusting your filters." icon={Gavel} />;
    }

    return (
        <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                    <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('date')}>Date <ArrowUpDown className="w-3 h-3 inline" /></th>
                    <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('lotIqc')}>Lot IQC <ArrowUpDown className="w-3 h-3 inline" /></th>
                    <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('partNo')}>Part No <ArrowUpDown className="w-3 h-3 inline" /></th>
                    <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('supplier')}>Supplier <ArrowUpDown className="w-3 h-3 inline" /></th>
                    <th className="px-4 py-4 border-r border-slate-200">Ship Lot</th>
                    <th className="px-4 py-4 border-r border-slate-200">Invoice No.</th>
                    <th className="px-4 py-4 border-r border-slate-200">Rev</th>
                    <th className="px-4 py-4 border-r border-slate-200">Country</th>
                    <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('judgment')}>Judgment <ArrowUpDown className="w-3 h-3 inline" /></th>
                    <th className="px-4 py-4 border-r border-slate-200">Action Lot</th>
                    <th className="px-4 py-4">Remark</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
                {results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 border-r border-slate-50">{item.date}</td>
                        <td className="px-4 py-3 border-r border-slate-50 font-mono text-slate-600">{item.lotIqc}</td>
                        <td className="px-4 py-3 border-r border-slate-50 font-bold text-slate-700">{item.partNo}</td>
                        <td className="px-4 py-3 border-r border-slate-50 text-slate-700">{item.supplier}</td>
                        <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{item.shipLot}</td>
                        <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{item.invoiceNo}</td>
                        <td className="px-4 py-3 border-r border-slate-50 text-center">{item.rev}</td>
                        <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{item.country}</td>
                        <td className="px-4 py-3 border-r border-slate-50">
                            <span className={`font-bold ${item.judgment === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {item.judgment}
                            </span>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{item.actionLot}</td>
                        <td className="px-4 py-3 text-slate-500 italic">{item.remark}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
