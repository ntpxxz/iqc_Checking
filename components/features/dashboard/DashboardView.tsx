'use client';

import React from 'react';
import {
    RefreshCw, LayoutGrid, Search,
    Calendar, ChevronDown, Package, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskTable } from '@/components/tables/TaskTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Task, InspectionRecord } from '@/types';
import { PaginationFooter } from '@/components/ui/Pagination';

interface DashboardViewProps {
    processedTasks: Task[];
    recentHistory: InspectionRecord[];
    visibleColumns: Record<string, boolean>;
    toggleColumn: (col: string) => void;
    showColumnMenu: boolean;
    setShowColumnMenu: (show: boolean) => void;
    columnLabels: Record<string, string>;
    showDateMenu: boolean;
    setShowDateMenu: (show: boolean) => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
    resetDateRange: () => void;
    warehouseFilter: string;
    setWarehouseFilter: (wh: string) => void;
    warehouses: string[];
    dataLoading: boolean;
    paginatedQueue: Task[];
    queuePage: number;
    setQueuePage: (page: number) => void;
    itemsPerPage: number;
    handleStartInspection: (task: Task) => void;
    requestSort: (key: string) => void;
    refreshTasks: () => void;
}

export function DashboardView({
    processedTasks,
    recentHistory,
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
    queuePage,
    setQueuePage,
    itemsPerPage,
    handleStartInspection,
    requestSort,
    refreshTasks,
}: DashboardViewProps) {
    return (
        <div className="space-y-6 fade-in">
            {/* Welcome Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 ms-card p-6 bg-gradient-to-br from-white to-[#FFFDE7] relative overflow-hidden group">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold text-[#323130] mb-2">Welcome back, Jane</h1>
                        <p className="text-[#605E5C] max-w-md leading-relaxed">
                            You have <span className="text-[#323130] font-bold">{processedTasks.length} inspections</span> pending in your queue today.
                            The system is synced and ready.
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10 group-hover:opacity-20 transition-opacity">
                        <img src="/dashboard_illustration.png" alt="Illustration" className="w-full h-full object-contain" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Pending" value={processedTasks.length} icon={Clock} colorClass="text-[#D83B01]" trend="+2" />
                    <StatCard label="Passed" value={recentHistory.filter(h => h.status === 'PASSED').length} icon={Package} colorClass="text-[#107C41]" trend="+12%" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="ms-card overflow-hidden bg-white">
                <div className="flex items-center justify-between p-4 border-b border-[#EDEBE9] bg-[#FAF9F8]">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-[#323130]">Inspection Queue</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={refreshTasks}
                            className="ms-button ms-button-secondary h-9"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Sync</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowColumnMenu(!showColumnMenu)}
                                className="ms-button ms-button-secondary h-9"
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Columns</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <AnimatePresence>
                                {showColumnMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white border border-[#EDEBE9] shadow-xl z-50 p-2 rounded-lg"
                                    >
                                        <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider px-3 py-2">Visible Columns</p>
                                        {Object.entries(columnLabels).map(([key, label]) => (
                                            <label key={key} className="flex items-center gap-3 px-3 py-2 hover:bg-[#F3F2F1] rounded-md cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={visibleColumns[key]}
                                                    onChange={() => toggleColumn(key)}
                                                    className="w-4 h-4 rounded border-[#8A8886] text-[#ffe500] focus:ring-[#ffe500]"
                                                />
                                                <span className="text-sm text-[#323130]">{label}</span>
                                            </label>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowDateMenu(!showDateMenu)}
                                className="ms-button ms-button-secondary h-9"
                            >
                                <Calendar className="w-4 h-4" />
                                <span className="hidden sm:inline">Date Range</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <AnimatePresence>
                                {showDateMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-72 bg-white border border-[#EDEBE9] shadow-xl z-50 p-4 rounded-lg"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    className="ms-input w-full"
                                                    value={dateRange.start}
                                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    className="ms-input w-full"
                                                    value={dateRange.end}
                                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                                />
                                            </div>
                                            <div className="pt-2 border-t border-[#EDEBE9] flex justify-end">
                                                <button onClick={resetDateRange} className="text-xs font-bold text-[#A4262C] hover:underline">Reset</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    {dataLoading ? (
                        <TableSkeleton rows={8} cols={6} />
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="queue"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <TaskTable
                                    tasks={paginatedQueue}
                                    visibleColumns={visibleColumns}
                                    onSort={requestSort}
                                    onInspect={handleStartInspection}
                                />
                                <div className="p-4 border-t border-[#EDEBE9]">
                                    <PaginationFooter currentPage={queuePage} totalItems={processedTasks.length} itemsPerPage={itemsPerPage} onPageChange={setQueuePage} />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
