'use client';

import React from 'react';
import {
    Eye, CalendarRange, RefreshCw, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JudgmentTable } from '@/components/tables/JudgmentTable';
import { PaginationFooter } from '@/components/ui/Pagination';

interface JudgmentViewProps {
    judgmentFilterText: string;
    setJudgmentFilterText: (text: string) => void;
    showJudgmentDateMenu: boolean;
    setShowJudgmentDateMenu: (show: boolean) => void;
    judgmentDateRange: { start: string; end: string };
    setJudgmentDateRange: (range: { start: string; end: string }) => void;
    resetJudgmentDateRange: () => void;
    setShowExportModal: (show: boolean) => void;
    paginatedJudgment: any[];
    judgmentPage: number;
    setJudgmentPage: (page: number) => void;
    processedJudgmentResults: any[];
    itemsPerPage: number;
    requestJudgmentSort: (key: string) => void;
}

export function JudgmentView({
    judgmentFilterText,
    setJudgmentFilterText,
    showJudgmentDateMenu,
    setShowJudgmentDateMenu,
    judgmentDateRange,
    setJudgmentDateRange,
    resetJudgmentDateRange,
    setShowExportModal,
    paginatedJudgment,
    judgmentPage,
    setJudgmentPage,
    processedJudgmentResults,
    itemsPerPage,
    requestJudgmentSort,
}: JudgmentViewProps) {
    return (
        <motion.div
            key="judgment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Judgment Results</h2>
                    <p className="text-sm text-slate-500 mt-1">View and export historical inspection judgments</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Eye className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter results..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all"
                            value={judgmentFilterText}
                            onChange={(e) => setJudgmentFilterText(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowJudgmentDateMenu(!showJudgmentDateMenu)} className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${judgmentDateRange.start || judgmentDateRange.end ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'}`}><CalendarRange className="w-4 h-4" /> <span className="hidden md:inline">Date Range</span></button>
                        {showJudgmentDateMenu && (
                            <div className="absolute right-0 top-12 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in zoom-in-95">
                                <div className="space-y-4">
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Start Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={judgmentDateRange.start} onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, start: e.target.value })} /></div>
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">End Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={judgmentDateRange.end} onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, end: e.target.value })} /></div>
                                    <div className="pt-3 border-t border-slate-50 flex justify-end">
                                        <button onClick={resetJudgmentDateRange} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reset Filters</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setShowExportModal(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"><Download className="w-4 h-4" /> Export</button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <JudgmentTable results={paginatedJudgment} onSort={requestJudgmentSort} />
                </div>
                <PaginationFooter currentPage={judgmentPage} totalItems={processedJudgmentResults.length} itemsPerPage={itemsPerPage} onPageChange={setJudgmentPage} />
            </div>
        </motion.div>
    );
}
