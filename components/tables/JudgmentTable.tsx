'use client';
import React from 'react';
import { Gavel, CheckCircle2, Ban, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { InspectionRecord } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface JudgmentTableProps {
    results: InspectionRecord[];
    selectedItems: string[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectItem: (id: string) => void;
    onSort: (key: string) => void;
    onItemClick?: (item: InspectionRecord) => void;
}

export const JudgmentTable: React.FC<JudgmentTableProps> = ({
    results,
    selectedItems,
    onSelectAll,
    onSelectItem,
    onSort,
    onItemClick
}) => {
    if (results.length === 0) {
        return <EmptyState message="No Judgment Results" subMessage="Inspection results will be archived here." icon={Gavel} />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="ms-table">
                <thead>
                    <tr>
                        <th className="w-10">
                            <input
                                type="checkbox"
                                onChange={onSelectAll}
                                checked={selectedItems.length === results.length && results.length > 0}
                                className="w-4 h-4 rounded border-[#8A8886] text-[#ffe500] focus:ring-[#ffe500]"
                            />
                        </th>
                        <th onClick={() => onSort('date')} className="cursor-pointer hover:bg-[#F3F2F1]">Date</th>
                        <th onClick={() => onSort('lotIqc')} className="cursor-pointer hover:bg-[#F3F2F1]">Lot IQC</th>
                        <th onClick={() => onSort('partNo')} className="cursor-pointer hover:bg-[#F3F2F1]">Part Details</th>
                        <th onClick={() => onSort('supplier')} className="cursor-pointer hover:bg-[#F3F2F1]">Supplier</th>
                        <th onClick={() => onSort('qty')} className="cursor-pointer hover:bg-[#F3F2F1]">Qty</th>
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
                            className="cursor-pointer hover:bg-[#F3F2F1]"
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        onSelectItem(item.id);
                                    }}
                                    className="w-4 h-4 rounded border-[#8A8886] text-[#ffe500] focus:ring-[#ffe500]"
                                />
                            </td>
                            <td onClick={() => onItemClick && onItemClick(item)} className="text-[#323130] font-medium">{item.date}</td>
                            <td onClick={() => onItemClick && onItemClick(item)} className="font-mono text-xs font-bold text-[#605E5C]">{item.lotIqc}</td>
                            <td onClick={() => onItemClick && onItemClick(item)}>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#323130]">{item.partNo}</span>
                                    <span className="text-[10px] text-[#605E5C] font-bold uppercase tracking-wider">{item.invoiceNo}</span>
                                </div>
                            </td>
                            <td onClick={() => onItemClick && onItemClick(item)} className="text-[#323130] font-medium">{item.supplier}</td>
                            <td onClick={() => onItemClick && onItemClick(item)} className="font-bold text-[#323130]">{item.qty.toLocaleString()}</td>
                            <td onClick={() => onItemClick && onItemClick(item)}>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.judgment === 'PASS' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FDE7E9] text-[#A4262C]'}`}>
                                    {item.judgment === 'PASS' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                    {item.judgment}
                                </span>
                            </td>
                            <td onClick={() => onItemClick && onItemClick(item)} className="text-[10px] font-bold text-[#605E5C] uppercase tracking-widest">{item.actionLot}</td>
                            <td onClick={() => onItemClick && onItemClick(item)} className="text-right">
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
