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
            return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'In Progress':
            return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'Completed':
            return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'Pending':
            return 'bg-slate-50 text-slate-600 border-slate-100';
        default:
            return 'bg-blue-50 text-blue-600 border-blue-100';
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
            <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4 border-b border-slate-100 w-10 text-center">
                            <input type="checkbox" className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-400 w-4 h-4" onChange={onSelectAll} checked={selectedItems.length === tasks.length && tasks.length > 0} />
                        </th>
                        {visibleColumns.urgent && <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('urgent')}>Urgent</th>}
                        {visibleColumns.id && <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('id')}>No <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>}
                        {visibleColumns.receivedAt && <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('receivedAt')}>Received Date</th>}
                        {visibleColumns.warehouse && <th className="px-6 py-4 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onSort('warehouse')}>Warehouse <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>}
                        {visibleColumns.inspectionType && <th className="px-6 py-4 border-b border-slate-100">Insp. Type</th>}
                        {visibleColumns.invoice && <th className="px-6 py-4 border-b border-slate-100">Invoice</th>}
                        {visibleColumns.lotNo && <th className="px-6 py-4 border-b border-slate-100">Lot IQC</th>}
                        {visibleColumns.part && <th className="px-6 py-4 border-b border-slate-100">Part No</th>}
                        {visibleColumns.vendor && <th className="px-6 py-4 border-b border-slate-100">Vendor</th>}
                        {visibleColumns.qty && <th className="px-6 py-4 border-b border-slate-100">Qty</th>}
                        {visibleColumns.iqcStatus && <th className="px-6 py-4 border-b border-slate-100 sticky right-[100px] bg-white/95 backdrop-blur-sm">Status</th>}
                        {visibleColumns.action && <th className="px-6 py-4 border-b border-slate-100 text-center sticky right-0 bg-white/95 backdrop-blur-sm">Action</th>}
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {tasks.map((task) => (
                        <tr key={task.id} className="group hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 border-b border-slate-50 text-center">
                                <input type="checkbox" className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-400 w-4 h-4" checked={selectedItems.includes(task.id)} onChange={() => onSelectItem(task.id)} />
                            </td>
                            {visibleColumns.urgent && (
                                <td className="px-6 py-4 border-b border-slate-50">
                                    {task.urgent ? (
                                        <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>YES</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">No</span>
                                    )}
                                </td>
                            )}
                            {visibleColumns.id && <td className="px-6 py-4 border-b border-slate-50 font-mono text-slate-500 text-xs">{task.id.split('-')[0]}...</td>}
                            {visibleColumns.receivedAt && (
                                <td className="px-6 py-4 border-b border-slate-50 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                                        {task.receivedAt}
                                    </div>
                                </td>
                            )}
                            {visibleColumns.warehouse && (
                                <td className="px-6 py-4 border-b border-slate-50 text-slate-600">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium">
                                        <Warehouse className="w-3 h-3 text-slate-400" />
                                        {task.warehouse || 'Main'}
                                    </div>
                                </td>
                            )}
                            {visibleColumns.inspectionType && <td className="px-6 py-4 border-b border-slate-50 text-slate-600">{task.inspectionType}</td>}
                            {visibleColumns.invoice && <td className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium">{task.invoice}</td>}
                            {visibleColumns.lotNo && <td className="px-6 py-4 border-b border-slate-50 font-mono text-slate-500 text-xs">{task.lotNo}</td>}
                            {visibleColumns.part && (
                                <td className="px-6 py-4 border-b border-slate-50">
                                    <div className="font-bold text-slate-700">{task.part}</div>
                                    <div className="text-[10px] text-slate-400 font-medium uppercase truncate max-w-[150px]">{task.partName}</div>
                                </td>
                            )}
                            {visibleColumns.vendor && <td className="px-6 py-4 border-b border-slate-50 text-slate-600">{task.vendor}</td>}
                            {visibleColumns.qty && <td className="px-6 py-4 border-b border-slate-50 text-slate-900 font-bold">{task.qty.toLocaleString()}</td>}
                            {visibleColumns.iqcStatus && (
                                <td className="px-6 py-4 border-b border-slate-50 sticky right-[100px] bg-white/95 backdrop-blur-sm group-hover:bg-slate-50/80 transition-colors">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(task.iqcStatus)}`}>
                                        {task.iqcStatus}
                                    </span>
                                </td>
                            )}
                            {visibleColumns.action && (
                                <td className="px-6 py-4 border-b border-slate-50 text-center sticky right-0 bg-white/95 backdrop-blur-sm group-hover:bg-slate-50/80 transition-colors">
                                    <button
                                        onClick={() => onInspect(task)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm hover:shadow-md active:scale-95"
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
