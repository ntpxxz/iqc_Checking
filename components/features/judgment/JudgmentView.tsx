'use client';

import React from 'react';
import {
    CalendarRange, RefreshCw, Download, ChevronDown, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="space-y-6 fade-in">
            {/* Command Bar */}
            <div className="h-12 bg-white border-b border-[#EDEBE9] flex items-center px-4 gap-2 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 mb-6 shadow-sm">
                <button
                    onClick={() => setShowExportModal(true)}
                    className="ms-button hover:bg-[#F3F2F1] text-[#323130]"
                >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                </button>

                <div className="w-px h-6 bg-[#EDEBE9] mx-1" />

                <div className="relative">
                    <button
                        onClick={() => setShowJudgmentDateMenu(!showJudgmentDateMenu)}
                        className="ms-button hover:bg-[#F3F2F1] text-[#323130]"
                    >
                        <CalendarRange className="w-4 h-4" />
                        <span>Filter by Date</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    <AnimatePresence>
                        {showJudgmentDateMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute left-0 mt-2 w-72 bg-white border border-[#EDEBE9] shadow-xl z-50 p-4 rounded-lg"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="ms-input w-full"
                                            value={judgmentDateRange.start}
                                            onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, start: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="ms-input w-full"
                                            value={judgmentDateRange.end}
                                            onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, end: e.target.value })}
                                        />
                                    </div>
                                    <div className="pt-3 border-t border-[#EDEBE9] flex justify-end">
                                        <button
                                            onClick={resetJudgmentDateRange}
                                            className="text-xs font-bold text-[#A4262C] hover:underline flex items-center gap-1.5"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" /> Reset
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#323130]">Judgment History</h2>
                    <p className="text-sm text-[#605E5C]">Comprehensive archive of all inspection results and decisions</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C]" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="ms-input w-full pl-10"
                        value={judgmentFilterText}
                        onChange={(e) => setJudgmentFilterText(e.target.value)}
                    />
                </div>
            </div>

            <div className="ms-card overflow-hidden bg-white">
                <div className="p-0">
                    <JudgmentTable results={paginatedJudgment} onSort={requestJudgmentSort} />
                </div>
                <div className="p-4 border-t border-[#EDEBE9] bg-[#FAF9F8]">
                    <PaginationFooter currentPage={judgmentPage} totalItems={processedJudgmentResults.length} itemsPerPage={itemsPerPage} onPageChange={setJudgmentPage} />
                </div>
            </div>
        </div>
    );
}
