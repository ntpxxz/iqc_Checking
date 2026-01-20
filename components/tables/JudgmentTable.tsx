'use client';
import React from 'react';
import { ArrowUpDown, Gavel, Calendar, Hash, Package, Truck, Globe, CheckCircle2, XCircle } from 'lucide-react';
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
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('date')}>Date <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                        <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('lotIqc')}>Lot IQC <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                        <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('partNo')}>Part No <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                        <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('supplier')}>Supplier <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                        <th className="px-6 py-4 border-b border-slate-100">Invoice No.</th>
                        <th className="px-6 py-4 border-b border-slate-100">Country</th>
                        <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('judgment')}>Judgment <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                        <th className="px-6 py-4 border-b border-slate-100">Action Lot</th>
                        <th className="px-6 py-4 border-b border-slate-100">Remark</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {results.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 border-b border-slate-50 text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                    {item.date}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 font-mono text-slate-500 text-xs">{item.lotIqc}</td>
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-slate-300" />
                                    <span className="font-bold text-slate-700">{item.partNo}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-3.5 h-3.5 text-slate-300" />
                                    {item.supplier}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 font-medium text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-3.5 h-3.5 text-slate-300" />
                                    {item.invoiceNo}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5 text-slate-300" />
                                    {item.country}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${item.judgment === 'PASS'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                    {item.judgment === 'PASS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {item.judgment}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium">{item.actionLot}</td>
                            <td className="px-6 py-4 border-b border-slate-50 text-slate-400 italic text-xs truncate max-w-[150px]">{item.remark}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
