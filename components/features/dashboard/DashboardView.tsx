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
            className="space-y-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Pending Tasks" value={processedTasks.length} icon={Clock} colorClass="bg-primary" />
                <StatCard label="Inspected Today" value={recentHistory.filter(h => h.date === new Date().toLocaleDateString('en-GB')).length} icon={CheckCircle2} colorClass="bg-success" trend="12%" />
                <StatCard label="Urgent Items" value={processedTasks.filter(t => t.urgent).length} icon={AlertCircle} colorClass="bg-accent" />
                <StatCard label="Avg Time/Lot" value="12m" icon={History} colorClass="bg-secondary" />
            </div>

            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_black] overflow-hidden">
                <div className="px-6 py-0 border-b-[3px] border-black flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-f0f0f0">
                    <div className="flex overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('queue')}
                            className={`px-8 py-5 text-sm font-black uppercase tracking-widest border-r-[3px] border-black transition-all relative ${activeTab === 'queue' ? 'bg-primary text-black' : 'bg-white text-black/40 hover:bg-primary/20'}`}
                        >
                            Inspection Queue
                            <span className={`ml-3 px-2 py-0.5 border-2 border-black text-[10px] font-black ${activeTab === 'queue' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                {processedTasks.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-8 py-5 text-sm font-black uppercase tracking-widest border-r-[3px] border-black transition-all ${activeTab === 'history' ? 'bg-primary text-black' : 'bg-white text-black/40 hover:bg-primary/20'}`}
                        >
                            Recent History
                        </button>
                    </div>

                    <div className="flex gap-4 p-4 items-center">
                        {activeTab === 'queue' && (
                            <>
                                <button
                                    onClick={refreshTasks}
                                    disabled={dataLoading}
                                    className={`flex items-center gap-2 px-6 py-3 border-[3px] border-black font-black uppercase text-xs transition-all ${dataLoading ? 'bg-f0f0f0 text-black/20 cursor-not-allowed' : 'bg-secondary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none'}`}
                                >
                                    <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                                    <span>{dataLoading ? 'Syncing...' : 'Sync Now'}</span>
                                </button>

                                {selectedItems.length > 0 && (
                                    <div className="flex items-center gap-3 animate-in slide-in-from-right fade-in">
                                        <span className="text-[11px] font-black text-black uppercase tracking-wider">{selectedItems.length} SELECTED</span>
                                        <button onClick={() => setShowPrintModal(true)} className="p-3 bg-white border-[3px] border-black hover:bg-accent hover:text-white hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1 transition-all" title="Print Labels"><Printer className="w-5 h-5" /></button>
                                    </div>
                                )}
                                <div className="relative">
                                    <button onClick={() => setShowColumnMenu(!showColumnMenu)} className={`p-3 border-[3px] border-black transition-all ${showColumnMenu ? 'bg-black text-white' : 'bg-white hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1'}`}><Eye className="w-5 h-5" /></button>
                                    {showColumnMenu && (
                                        <div className="absolute right-0 top-16 w-64 bg-white border-[3px] border-black shadow-[8px_8px_0px_black] p-5 z-50 animate-in fade-in zoom-in-95">
                                            <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-4">Toggle Columns</h4>
                                            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                {Object.keys(visibleColumns).map(key => (
                                                    <label key={key} className="flex items-center gap-3 text-xs font-black uppercase cursor-pointer hover:bg-primary/20 p-2 border-2 border-transparent hover:border-black transition-all">
                                                        <input type="checkbox" checked={visibleColumns[key]} onChange={() => toggleColumn(key)} className="border-[3px] border-black text-black focus:ring-0 w-5 h-5 rounded-none" />
                                                        <span className="text-black">{columnLabels[key] || key}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button onClick={() => setShowDateMenu(!showDateMenu)} className={`p-3 border-[3px] border-black transition-all flex items-center gap-3 text-xs font-black uppercase ${dateRange.start || dateRange.end ? 'bg-accent text-white shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1' : 'bg-white hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1'}`}><CalendarRange className="w-5 h-5" /> <span className="hidden md:inline">Date Range</span></button>
                                    {showDateMenu && (
                                        <div className="absolute right-0 top-16 w-72 bg-white border-[3px] border-black shadow-[8px_8px_0px_black] p-6 z-50 animate-in fade-in zoom-in-95">
                                            <div className="space-y-5">
                                                <div><label className="text-[11px] font-black text-black uppercase tracking-wider block mb-2">Start Date</label><input type="date" className="w-full border-[3px] border-black bg-f0f0f0 p-3 text-sm font-black uppercase focus:bg-white outline-none transition-all" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /></div>
                                                <div><label className="text-[11px] font-black text-black uppercase tracking-wider block mb-2">End Date</label><input type="date" className="w-full border-[3px] border-black bg-f0f0f0 p-3 text-sm font-black uppercase focus:bg-white outline-none transition-all" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                                                <div className="pt-4 border-t-[3px] border-black flex justify-end">
                                                    <button onClick={resetDateRange} className="text-[10px] font-black text-black hover:text-accent transition-colors flex items-center gap-2 uppercase"><RefreshCw className="w-4 h-4" /> Reset Filters</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Warehouse Filter */}
                                <div className="relative">
                                    <Warehouse className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none z-10" />
                                    <select
                                        value={warehouseFilter}
                                        onChange={(e) => setWarehouseFilter(e.target.value)}
                                        className={`pl-12 pr-8 py-3 border-[3px] border-black outline-none text-xs font-black uppercase transition-all appearance-none cursor-pointer ${warehouseFilter !== 'all' ? 'bg-primary shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1' : 'bg-white hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1'}`}
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
