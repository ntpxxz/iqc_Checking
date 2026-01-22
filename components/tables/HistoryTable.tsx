'use client';
import React from 'react';
import { History, CheckCircle2, Ban, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
            <table className="ms-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Part Details</th>
                        <th>Supplier</th>
                        <th>Quantity</th>
                        <th>Date & Time</th>
                        <th>Inspector</th>
                        <th className="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, idx) => (
                        <motion.tr
                            key={idx}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.03 }}
                            className="group cursor-pointer"
                            onClick={() => onItemClick(item)}
                        >
                            <td>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'PASSED' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FDE7E9] text-[#A4262C]'}`}>
                                    {item.status === 'PASSED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                    {item.status}
                                </span>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#323130]">{item.part}</span>
                                    <span className="text-xs text-[#605E5C]">{item.partName}</span>
                                </div>
                            </td>
                            <td className="text-[#323130] font-medium">{item.vendor}</td>
                            <td className="font-bold text-[#323130]">{item.qty.toLocaleString()}</td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#323130]">{item.date}</span>
                                    <span className="text-[10px] text-[#605E5C] font-bold uppercase tracking-wider">{item.time}</span>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-[#F3F2F1] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#605E5C] border border-[#EDEBE9]">
                                        {item.inspector.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <span className="text-sm font-medium text-[#323130]">{item.inspector}</span>
                                </div>
                            </td>
                            <td className="text-right">
                                <button className="p-2 rounded-lg hover:bg-[#ffe500] hover:text-[#323130] text-[#605E5C] transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
