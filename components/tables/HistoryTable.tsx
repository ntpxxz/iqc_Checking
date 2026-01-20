'use client';
import React from 'react';
import { CheckCircle2, Ban, Truck, User, History, Calendar, Clock } from 'lucide-react';
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
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4 border-b border-slate-100">Status</th>
                        <th className="px-6 py-4 border-b border-slate-100">Date & Time</th>
                        <th className="px-6 py-4 border-b border-slate-100">Lot ID</th>
                        <th className="px-6 py-4 border-b border-slate-100">Part Details</th>
                        <th className="px-6 py-4 border-b border-slate-100">Supplier</th>
                        <th className="px-6 py-4 border-b border-slate-100">Quantity</th>
                        <th className="px-6 py-4 border-b border-slate-100">Inspector</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {history.map((item, idx) => (
                        <tr
                            key={idx}
                            className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                            onClick={() => onItemClick(item)}
                        >
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${item.status === 'RELEASED'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                    {item.status === 'RELEASED' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                    {item.status}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                        <Calendar className="w-3 h-3 text-slate-300" />
                                        {item.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                        <Clock className="w-3 h-3 text-slate-300" />
                                        {item.time}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 font-mono text-xs text-slate-500">{item.lotNo}</td>
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className="font-bold text-slate-700">{item.part}</div>
                                <div className="text-[10px] text-slate-400 font-medium uppercase truncate max-w-[150px]">{item.partName}</div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Truck className="w-3.5 h-3.5 text-slate-300" />
                                    {item.vendor}
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-slate-50 text-slate-900 font-bold">{item.qty.toLocaleString()}</td>
                            <td className="px-6 py-4 border-b border-slate-50">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {item.inspector.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {item.inspector}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
