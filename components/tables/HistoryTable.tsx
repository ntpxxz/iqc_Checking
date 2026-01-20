'use client';
import React from 'react';
import { CheckCircle2, Ban, Truck, User, History } from 'lucide-react';
import { HistoryItem } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface HistoryTableProps {
    history: HistoryItem[];
    onItemClick: (item: HistoryItem) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onItemClick }) => {
    if (history.length === 0) {
        return <EmptyState message="No History Found" subMessage="Recent inspections will appear here." icon={History} />;
    }

    return (
        <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                    <th className="px-4 py-4 border-r border-slate-200">Status</th>
                    <th className="px-4 py-4 border-r border-slate-200">Date/Time</th>
                    <th className="px-4 py-4 border-r border-slate-200">Lot ID</th>
                    <th className="px-4 py-4 border-r border-slate-200">Part Info</th>
                    <th className="px-4 py-4 border-r border-slate-200">Supplier</th>
                    <th className="px-4 py-4 border-r border-slate-200">Qty</th>
                    <th className="px-4 py-4">Inspector</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
                {history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 cursor-pointer" onClick={() => onItemClick(item)}>
                        <td className="px-4 py-3 border-r border-slate-50">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${item.status === 'RELEASED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                                }`}>
                                {item.status === 'RELEASED' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                {item.status}
                            </div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-50 text-slate-500 text-xs">
                            <div className="font-semibold text-slate-700">{item.date}</div>
                            <div>{item.time}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-50 font-mono text-xs text-slate-500">{item.lotNo}</td>
                        <td className="px-4 py-3 border-r border-slate-50">
                            <div className="font-bold text-slate-700 text-xs">{item.part}</div>
                            <div className="text-[10px] text-slate-500">{item.partName}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-50 text-xs text-slate-600 flex items-center gap-1">
                            <Truck className="w-3 h-3 text-slate-400" /> {item.vendor}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-50 text-xs font-bold text-slate-700">{item.qty}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" /> {item.inspector}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
