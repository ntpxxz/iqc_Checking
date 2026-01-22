'use client';
import React from 'react';
import { Gavel, CheckCircle2, Ban, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { InspectionRecord } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface JudgmentTableProps {
    results: InspectionRecord[];
    onSort: (key: string) => void;
    onItemClick?: (item: InspectionRecord) => void;
}

export const JudgmentTable: React.FC<JudgmentTableProps> = ({ results, onSort, onItemClick }) => {
    if (results.length === 0) {
        return <EmptyState message="No Judgment Results" subMessage="Inspection results will be archived here." icon={Gavel} />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="ms-table">
                <thead>
                    <tr>
                        <th onClick={() => onSort('date')} className="cursor-pointer hover:bg-[#F3F2F1]">Date</th>
                        <th onClick={() => onSort('lotIqc')} className="cursor-pointer hover:bg-[#F3F2F1]">Lot IQC</th>
                        <th onClick={() => onSort('partNo')} className="cursor-pointer hover:bg-[#F3F2F1]">Part Details</th>
                        <th onClick={() => onSort('supplier')} className="cursor-pointer hover:bg-[#F3F2F1]">Supplier</th>
                        <th onClick={() => onSort('qty')} className="cursor-pointer hover:bg-[#F3F2F1]">Qty</th>
                        <th onClick={() => onSort('samplingType')} className="cursor-pointer hover:bg-[#F3F2F1]">Sampling</th>
                        <th onClick={() => onSort('judgment')} className="cursor-pointer hover:bg-[#F3F2F1]">Judgment</th>
                        <th onClick={() => onSort('actionLot')} className="cursor-pointer hover:bg-[#F3F2F1]">Action</th>
                        <th className="text-right">Inspector</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item, idx) => (
                        <motion.tr
                            key={idx}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.03 }}
                            onClick={() => onItemClick && onItemClick(item)}
                            className="cursor-pointer hover:bg-[#F3F2F1]"
                        >
                            <td className="text-[#323130] font-medium">{item.date}</td>
                            <td className="font-mono text-xs font-bold text-[#605E5C]">{item.lotIqc}</td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#323130]">{item.partNo}</span>
                                    <span className="text-[10px] text-[#605E5C] font-bold uppercase tracking-wider">{item.invoiceNo}</span>
                                </div>
                            </td>
                            <td className="text-[#323130] font-medium">{item.supplier}</td>
                            <td className="font-bold text-[#323130]">{item.qty.toLocaleString()}</td>
                            <td className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">{item.samplingType}</td>
                            <td>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.judgment === 'PASS' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FDE7E9] text-[#A4262C]'}`}>
                                    {item.judgment === 'PASS' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                    {item.judgment}
                                </span>
                            </td>
                            <td className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest">{item.actionLot}</td>
                            <td className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-sm font-medium text-[#323130]">{item.inspector}</span>
                                    <div className="w-7 h-7 bg-[#F3F2F1] rounded-lg flex items-center justify-center text-[10px] font-bold text-[#605E5C] border border-[#EDEBE9]">
                                        {item.inspector.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
