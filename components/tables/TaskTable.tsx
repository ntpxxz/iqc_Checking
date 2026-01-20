'use client';
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Task } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { PackageCheck } from 'lucide-react';

interface TaskTableProps {
    tasks: Task[];
    selectedItems: string[];
    visibleColumns: Record<string, boolean>;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectItem: (id: string) => void;
    onSort: (key: string) => void;
    onInspect: (task: Task) => void;
}

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
        <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                    <th className="px-4 py-4 border-r border-slate-200 w-10 text-center">
                        <input type="checkbox" className="rounded border-slate-300 text-yellow-600 focus:ring-yellow-400" onChange={onSelectAll} checked={selectedItems.length === tasks.length && tasks.length > 0} />
                    </th>
                    {visibleColumns.urgent && <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('urgent')}>Urgent</th>}
                    {visibleColumns.id && <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('id')}>No <ArrowUpDown className="w-3 h-3 inline" /></th>}
                    {visibleColumns.receivedAt && <th className="px-4 py-4 border-r border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => onSort('receivedAt')}>Received Date</th>}
                    {visibleColumns.inspectionType && <th className="px-4 py-4 border-r border-slate-200">Insp. Type</th>}
                    {visibleColumns.invoice && <th className="px-4 py-4 border-r border-slate-200">Invoice</th>}
                    {visibleColumns.lotNo && <th className="px-4 py-4 border-r border-slate-200">Lot IQC</th>}
                    {visibleColumns.model && <th className="px-4 py-4 border-r border-slate-200">Model</th>}
                    {visibleColumns.partName && <th className="px-4 py-4 border-r border-slate-200">Part Type</th>}
                    {visibleColumns.part && <th className="px-4 py-4 border-r border-slate-200">Part No</th>}
                    {visibleColumns.rev && <th className="px-4 py-4 border-r border-slate-200">Rev.</th>}
                    {visibleColumns.vendor && <th className="px-4 py-4 border-r border-slate-200">Vendor</th>}
                    {visibleColumns.qty && <th className="px-4 py-4 border-r border-slate-200">Qty</th>}
                    {visibleColumns.samplingType && <th className="px-4 py-4 border-r border-slate-200">Sampling</th>}
                    {visibleColumns.totalSampling && <th className="px-4 py-4 border-r border-slate-200">Total Sample</th>}
                    {visibleColumns.aql && <th className="px-4 py-4 border-r border-slate-200">AQL</th>}
                    {visibleColumns.receiver && <th className="px-4 py-4 border-r border-slate-200">Receiver</th>}
                    {visibleColumns.issue && <th className="px-4 py-4 border-r border-slate-200">Issue</th>}
                    {visibleColumns.timestamp && <th className="px-4 py-4 border-r border-slate-200">Timestamp</th>}
                    {visibleColumns.iqcStatus && <th className="px-4 py-4 sticky right-0 border-r border-slate-200">Status</th>}
                    {visibleColumns.action && <th className="px-4 py-4 text-center sticky right-0 bg-slate-100 shadow-sm">Action</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
                {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 border-r border-slate-50 text-center"><input type="checkbox" className="rounded border-slate-300 text-yellow-600 focus:ring-yellow-400" checked={selectedItems.includes(task.id)} onChange={() => onSelectItem(task.id)} /></td>
                        {visibleColumns.urgent && <td className="px-4 py-3 border-r border-slate-50 text-center">{task.urgent ? <span className="text-rose-600 font-bold">YES</span> : 'No'}</td>}
                        {visibleColumns.id && <td className="px-4 py-3 border-r border-slate-50 font-mono text-slate-500">{task.id}</td>}
                        {visibleColumns.receivedAt && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.receivedAt}</td>}
                        {visibleColumns.inspectionType && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.inspectionType}</td>}
                        {visibleColumns.invoice && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.invoice}</td>}
                        {visibleColumns.lotNo && <td className="px-4 py-3 border-r border-slate-50 font-mono text-slate-600">{task.lotNo}</td>}
                        {visibleColumns.model && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.model}</td>}
                        {visibleColumns.partName && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.partName}</td>}
                        {visibleColumns.part && <td className="px-4 py-3 border-r border-slate-50 font-bold text-slate-700">{task.part}</td>}
                        {visibleColumns.rev && <td className="px-4 py-3 border-r border-slate-50 text-center text-slate-600">{task.rev}</td>}
                        {visibleColumns.vendor && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.vendor}</td>}
                        {visibleColumns.qty && <td className="px-4 py-3 border-r border-slate-50 text-slate-700 font-bold">{task.qty}</td>}
                        {visibleColumns.samplingType && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.samplingType}</td>}
                        {visibleColumns.totalSampling && <td className="px-4 py-3 border-r border-slate-50 text-slate-600 text-center">{task.totalSampling}</td>}
                        {visibleColumns.aql && <td className="px-4 py-3 border-r border-slate-50 text-slate-600 text-center">{task.aql}</td>}
                        {visibleColumns.receiver && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.receiver}</td>}
                        {visibleColumns.issue && <td className="px-4 py-3 border-r border-slate-50 text-slate-600">{task.issue}</td>}
                        {visibleColumns.timestamp && <td className="px-4 py-3 border-r border-slate-50 text-slate-500 text-[10px]">{task.timestamp}</td>}
                        {visibleColumns.iqcStatus && <td className="px-4 py-3 sticky right-0 border-r border-slate-50"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{task.iqcStatus}</span></td>}
                        {visibleColumns.action && <td className="px-4 py-3 text-center sticky right-0 bg-white shadow-sm border-l border-slate-100"><button onClick={() => onInspect(task)} className="text-slate-900 font-bold bg-yellow-400 px-3 py-1.5 rounded hover:bg-yellow-500">Inspect</button></td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
