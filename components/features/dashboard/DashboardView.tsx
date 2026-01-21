'use client';

import React from 'react';
import {
    Clock, CheckCircle2, AlertCircle, History, Printer, Eye,
    CalendarRange, RefreshCw, Warehouse
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskTable } from '@/components/tables/TaskTable';
import { HistoryTable } from '@/components/tables/HistoryTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { PaginationFooter } from '@/components/ui/Pagination';
import { Task, HistoryItem } from '@/types';

interface DashboardViewProps {
    processedTasks: Task[];
    recentHistory: HistoryItem[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    selectedItems: string[];
    visibleColumns: Record<string, boolean>;
    toggleColumn: (colKey: string) => void;
    showColumnMenu: boolean;
    setShowColumnMenu: (show: boolean) => void;
    columnLabels: Record<string, string>;
    showDateMenu: boolean;
    setShowDateMenu: (show: boolean) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
    resetDateRange: () => void;
    warehouseFilter: string;
    setWarehouseFilter: (filter: string) => void;
    warehouses: string[];
    dataLoading: boolean;
    paginatedQueue: Task[];
    paginatedHistory: HistoryItem[];
    queuePage: number;
    setQueuePage: (page: number) => void;
    historyPage: number;
    setHistoryPage: (page: number) => void;
    itemsPerPage: number;
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectItem: (id: string) => void;
    handleStartInspection: (task: Task) => void;
    setShowPrintModal: (show: boolean) => void;
    setShowDetailModal: (item: HistoryItem | null) => void;
    requestSort: (key: string) => void;
    refreshTasks: () => void;
}

export function DashboardView({
    processedTasks,
    recentHistory,
    activeTab,
    setActiveTab,
    selectedItems,
    visibleColumns,
    toggleColumn,
    showColumnMenu,
    setShowColumnMenu,
    columnLabels,
    showDateMenu,
    setShowDateMenu,
    dateRange,
    setDateRange,
    resetDateRange,
    warehouseFilter,
    setWarehouseFilter,
    warehouses,
    dataLoading,
    paginatedQueue,
    paginatedHistory,
    queuePage,
    setQueuePage,
    historyPage,
    setHistoryPage,
    itemsPerPage,
    handleSelectAll,
    handleSelectItem,
    handleStartInspection,
    setShowPrintModal,
    setShowDetailModal,
    requestSort,
    refreshTasks,
}: DashboardViewProps) {
    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Pending Tasks" value={processedTasks.length} icon={Clock} colorClass="bg-blue-50 text-blue-600" />
                <StatCard label="Inspected Today" value={recentHistory.filter(h => h.date === new Date().toLocaleDateString('en-GB')).length} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" trend="12%" />
                <StatCard label="Urgent Items" value={processedTasks.filter(t => t.urgent).length} icon={AlertCircle} colorClass="bg-rose-50 text-rose-600" />
                <StatCard label="Avg Time/Lot" value="12m" icon={History} colorClass="bg-amber-50 text-amber-600" />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-2 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex gap-8 overflow-x-auto w-full md:w-auto no-scrollbar">
                        <button onClick={() => setActiveTab('queue')} className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap relative ${activeTab === 'queue' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                            Inspection Queue
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] transition-colors ${activeTab === 'queue' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                {processedTasks.length}
                            </span>
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'history' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                            Recent History
                        </button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto items-center">
                        {activeTab === 'queue' && (
                            <>
                                <button
                                    onClick={refreshTasks}
                                    disabled={dataLoading}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${dataLoading ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-sm hover:shadow-md'}`}
                                >
                                    <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                                    <span>{dataLoading ? 'Syncing...' : 'Sync Now'}</span>
                                </button>

                                {selectedItems.length > 0 && (
                                    <div className="flex items-center gap-2 mr-2 animate-in slide-in-from-right fade-in">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{selectedItems.length} selected</span>
                                        <button onClick={() => setShowPrintModal(true)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 transition-all" title="Print Labels"><Printer className="w-4 h-4" /></button>
                                    </div>
                                )}
                                <div className="relative">
                                    <button onClick={() => setShowColumnMenu(!showColumnMenu)} className={`p-2 border rounded-xl transition-all ${showColumnMenu ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500'}`}><Eye className="w-4 h-4" /></button>
                                    {showColumnMenu && (
                                        <div className="absolute right-0 top-12 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Toggle Columns</h4>
                                            <div className="max-h-64 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                                                {Object.keys(visibleColumns).map(key => (
                                                    <label key={key} className="flex items-center gap-3 text-xs font-medium cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                                                        <input type="checkbox" checked={visibleColumns[key]} onChange={() => toggleColumn(key)} className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-400 w-4 h-4" />
                                                        <span className="text-slate-600">{columnLabels[key] || key}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button onClick={() => setShowDateMenu(!showDateMenu)} className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${dateRange.start || dateRange.end ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500'}`}><CalendarRange className="w-4 h-4" /> <span className="hidden md:inline">Date Range</span></button>
                                    {showDateMenu && (
                                        <div className="absolute right-0 top-12 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in zoom-in-95">
                                            <div className="space-y-4">
                                                <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Start Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /></div>
                                                <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">End Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                                                <div className="pt-3 border-t border-slate-50 flex justify-end">
                                                    <button onClick={resetDateRange} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reset Filters</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Warehouse Filter */}
                                <div className="relative">
                                    <Warehouse className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <select
                                        value={warehouseFilter}
                                        onChange={(e) => setWarehouseFilter(e.target.value)}
                                        className={`pl-9 pr-4 py-2.5 border rounded-xl outline-none text-xs font-bold transition-all appearance-none cursor-pointer ${warehouseFilter !== 'all' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500'}`}
                                    >
                                        <option value="all">All Warehouses</option>
                                        {warehouses.map((wh) => (
                                            <option key={wh} value={wh}>{wh}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {activeTab === 'queue' && (
                    <div className="overflow-x-auto">
                        {dataLoading ? <TableSkeleton cols={10} rows={5} /> : (
                            <TaskTable
                                tasks={paginatedQueue}
                                selectedItems={selectedItems}
                                visibleColumns={visibleColumns}
                                onSelectAll={handleSelectAll}
                                onSelectItem={handleSelectItem}
                                onSort={requestSort}
                                onInspect={handleStartInspection}
                            />
                        )}
                        <PaginationFooter currentPage={queuePage} totalItems={processedTasks.length} itemsPerPage={itemsPerPage} onPageChange={setQueuePage} />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            {dataLoading ? <TableSkeleton cols={7} rows={5} /> : (
                                <HistoryTable history={paginatedHistory} onItemClick={setShowDetailModal} />
                            )}
                        </div>
                        <PaginationFooter currentPage={historyPage} totalItems={recentHistory.length} itemsPerPage={itemsPerPage} onPageChange={setHistoryPage} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
