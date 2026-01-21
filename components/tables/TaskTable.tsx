'use client';
import React from 'react';
import { ArrowUpDown, Warehouse, PackageCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
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
            return 'bg-primary text-black border-black';
        case 'In Progress':
            return 'bg-secondary text-black border-black';
        case 'Completed':
            return 'bg-success text-black border-black';
        case 'Pending':
            return 'bg-white text-black border-black';
        default:
            return 'bg-secondary text-black border-black';
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
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-[11px] font-black text-black uppercase tracking-[0.15em] bg-f0f0f0">
                        <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black w-16 text-center">
                            <input type="checkbox" className="border-[3px] border-black text-black focus:ring-0 w-5 h-5 rounded-none cursor-pointer" onChange={onSelectAll} checked={selectedItems.length === tasks.length && tasks.length > 0} />
                        </th>
                        {visibleColumns.urgent && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black cursor-pointer hover:bg-primary transition-colors" onClick={() => onSort('urgent')}>Urgent</th>}
                        {visibleColumns.id && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black cursor-pointer hover:bg-primary transition-colors" onClick={() => onSort('id')}>No <ArrowUpDown className="w-4 h-4 inline ml-1" /></th>}
                        {visibleColumns.receivedAt && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black cursor-pointer hover:bg-primary transition-colors" onClick={() => onSort('receivedAt')}>Received</th>}
                        {visibleColumns.warehouse && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black cursor-pointer hover:bg-primary transition-colors" onClick={() => onSort('warehouse')}>Warehouse <ArrowUpDown className="w-4 h-4 inline ml-1" /></th>}
                        {visibleColumns.inspectionType && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">Type</th>}
                        {visibleColumns.invoice && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">Invoice</th>}
                        {visibleColumns.lotNo && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">Lot IQC</th>}
                        {visibleColumns.part && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">Part Info</th>}
                        {visibleColumns.vendor && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">Vendor</th>}
                        {visibleColumns.qty && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">Qty</th>}
                        {visibleColumns.iqcStatus && <th className="px-6 py-5 border-b-[3px] border-r-[3px] border-black sticky right-[120px] bg-f0f0f0 z-10">Status</th>}
                        {visibleColumns.action && <th className="px-6 py-5 border-b-[3px] border-black text-center sticky right-0 bg-f0f0f0 z-10">Action</th>}
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {tasks.map((task) => (
                        <tr key={task.id} className="group hover:bg-primary/10 transition-colors">
                            <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black text-center">
                                <input type="checkbox" className="border-[3px] border-black text-black focus:ring-0 w-5 h-5 rounded-none cursor-pointer" checked={selectedItems.includes(task.id)} onChange={() => onSelectItem(task.id)} />
                            </td>
                            {visibleColumns.urgent && (
                                <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">
                                    {task.urgent ? (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent border-2 border-black text-white font-black text-[10px] uppercase shadow-[2px_2px_0px_black]">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>URGENT</span>
                                        </div>
                                    ) : (
                                        <span className="text-black/40 font-bold uppercase text-[10px]">Normal</span>
                                    )}
                                </td>
                            )}
                            {visibleColumns.id && <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black font-black text-black text-xs uppercase">{task.id.split('-')[0]}</td>}
                            {visibleColumns.receivedAt && (
                                <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black text-black font-bold uppercase text-xs">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-black" />
                                        {task.receivedAt}
                                    </div>
                                </td>
                            )}
                            {visibleColumns.warehouse && (
                                <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary border-2 border-black text-[10px] font-black uppercase shadow-[2px_2px_0px_black]">
                                        <Warehouse className="w-3.5 h-3.5" />
                                        {task.warehouse || 'Main'}
                                    </div>
                                </td>
                            )}
                            {visibleColumns.inspectionType && <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black text-black font-bold uppercase text-xs">{task.inspectionType}</td>}
                            {visibleColumns.invoice && <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black text-black font-black uppercase text-xs">{task.invoice}</td>}
                            {visibleColumns.lotNo && <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black font-black text-black/60 text-xs uppercase">{task.lotNo}</td>}
                            {visibleColumns.part && (
                                <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black">
                                    <div className="font-black text-black uppercase tracking-tight">{task.part}</div>
                                    <div className="text-[10px] text-black/60 font-black uppercase truncate max-w-[150px] mt-1">{task.partName}</div>
                                </td>
                            )}
                            {visibleColumns.vendor && <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black text-black font-bold uppercase text-xs">{task.vendor}</td>}
                            {visibleColumns.qty && <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black text-black font-black text-base tracking-tighter">{task.qty.toLocaleString()}</td>}
                            {visibleColumns.iqcStatus && (
                                <td className="px-6 py-5 border-b-[3px] border-r-[3px] border-black sticky right-[120px] bg-white group-hover:bg-primary/5 transition-colors z-10">
                                    <span className={`inline-flex items-center px-3 py-1 border-[3px] text-[10px] font-black uppercase shadow-[3px_3px_0px_black] ${getStatusBadge(task.iqcStatus)}`}>
                                        {task.iqcStatus}
                                    </span>
                                </td>
                            )}
                            {visibleColumns.action && (
                                <td className="px-6 py-5 border-b-[3px] border-black text-center sticky right-0 bg-white group-hover:bg-primary/5 transition-colors z-10">
                                    <button
                                        onClick={() => onInspect(task)}
                                        className="bg-primary hover:bg-black hover:text-white border-[3px] border-black font-black px-5 py-2 text-[10px] uppercase transition-all shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95"
                                    >
                                        Inspect
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
