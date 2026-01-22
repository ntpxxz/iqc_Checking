'use client';
import React from 'react';
import { PackageCheck, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskTableProps {
    tasks: Task[];
    selectedItems: string[];
    visibleColumns: Record<string, boolean>;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectItem: (id: string) => void;
    onSort: (key: string) => void;
    onInspect: (task: Task) => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Waiting IQ':
            return 'text-[#0078D4] bg-[#DEECF9]';
        case 'In Progress':
            return 'text-[#107C41] bg-[#DFF6DD]';
        case 'Completed':
            return 'text-[#107C41] bg-[#DFF6DD]';
        case 'Pending':
            return 'text-[#605E5C] bg-[#F3F2F1]';
        default:
            return 'text-[#605E5C] bg-[#F3F2F1]';
    }
};

export const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    selectedItems,
    visibleColumns,
    onSelectAll,
    onSelectItem,
    onSort,
    onInspect
}) => {
    if (tasks.length === 0) {
        return <EmptyState message="No Pending Tasks" subMessage="Great job! The queue is empty." icon={PackageCheck} />;
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
                                checked={selectedItems.length === tasks.length && tasks.length > 0}
                                className="w-4 h-4 rounded border-[#8A8886] text-[#ffe500] focus:ring-[#ffe500]"
                            />
                        </th>
                        {visibleColumns.urgent && <th onClick={() => onSort('urgent')} className="cursor-pointer hover:bg-[#F3F2F1]">Priority</th>}
                        {visibleColumns.invoice && <th onClick={() => onSort('invoice')} className="cursor-pointer hover:bg-[#F3F2F1]">Invoice No</th>}
                        {visibleColumns.part && <th onClick={() => onSort('part')} className="cursor-pointer hover:bg-[#F3F2F1]">Part Details</th>}
                        {visibleColumns.part && <th onClick={() => onSort('lotIqc')} className="cursor-pointer hover:bg-[#F3F2F1]">Lot IQC</th>}

                        {visibleColumns.qty && <th onClick={() => onSort('qty')} className="cursor-pointer hover:bg-[#F3F2F1]">Quantity</th>}
                        {visibleColumns.receivedAt && <th onClick={() => onSort('receivedAt')} className="cursor-pointer hover:bg-[#F3F2F1]">Received</th>}
                        {visibleColumns.iqcStatus && <th onClick={() => onSort('iqcStatus')} className="cursor-pointer hover:bg-[#F3F2F1]">Status</th>}
                        <th className="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <motion.tr
                            key={task.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="group"
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(task.id)}
                                    onChange={() => onSelectItem(task.id)}
                                    className="w-4 h-4 rounded border-[#8A8886] text-[#ffe500] focus:ring-[#ffe500]"
                                />
                            </td>
                            {visibleColumns.urgent && (
                                <td>
                                    {task.urgent ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FDE7E9] text-[#A4262C] text-[10px] font-bold uppercase">
                                            <AlertCircle className="w-3 h-3" /> Urgent
                                        </span>
                                    ) : (
                                        <span className="text-[#605E5C] text-xs">Normal</span>
                                    )}
                                </td>
                            )}
                            {visibleColumns.invoice && (
                                <td className="font-mono text-xs font-bold text-[#605E5C]">
                                    {task.invoice}
                                </td>
                            )}
                            {visibleColumns.part && (
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#323130]">{task.part}</span>
                                        <span className="text-xs text-[#605E5C]">{task.partName}</span>
                                    </div>
                                </td>
                            )}
                            {visibleColumns.qty && (
                                <td className="font-bold text-[#323130]">
                                    {task.qty.toLocaleString()}
                                </td>
                            )}
                            {visibleColumns.qty && (
                                <td className="font-bold text-[#323130]">
                                    {task.qty.toLocaleString()}
                                </td>
                            )}
                            {visibleColumns.receivedAt && (
                                <td>
                                    <div className="flex items-center gap-1.5 text-[#605E5C]">
                                        <Clock className="w-3.5 h-3.5 opacity-60" />
                                        <span className="text-xs">{task.receivedAt}</span>
                                    </div>
                                </td>
                            )}
                            {visibleColumns.iqcStatus && (
                                <td>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(task.iqcStatus)}`}>
                                        {task.iqcStatus}
                                    </span>
                                </td>
                            )}
                            <td className="text-center">
                                <button
                                    onClick={() => onInspect(task)}
                                    className="h-8 px-3 rounded-md bg-[#F3F2F1] text-[#323130] hover:bg-[#ffe500] transition-colors text-xs font-bold flex items-center gap-1 ml-auto"
                                >
                                    Inspect
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
