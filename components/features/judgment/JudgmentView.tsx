'use client';

import React from 'react';
import {
    CalendarRange, RefreshCw, Download, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JudgmentTable } from '@/components/tables/JudgmentTable';
import { PaginationFooter } from '@/components/ui/Pagination';
import { InspectionRecord } from '@/types';

interface JudgmentViewProps {
    showJudgmentDateMenu: boolean;
    setShowJudgmentDateMenu: (show: boolean) => void;
    judgmentDateRange: { start: string; end: string };
    setJudgmentDateRange: (range: { start: string; end: string }) => void;
    resetJudgmentDateRange: () => void;
    setShowExportModal: (show: boolean) => void;
    paginatedJudgment: InspectionRecord[];
    judgmentPage: number;
    setJudgmentPage: (page: number) => void;
    processedJudgmentResults: InspectionRecord[];
    itemsPerPage: number;
    requestJudgmentSort: (key: string) => void;
    setShowDetailModal: (item: InspectionRecord | null) => void;
    selectedHistory: string[];
    onSelectAllHistory: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectItemHistory: (id: string) => void;
}

export function JudgmentView({
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
    setShowDetailModal,
    selectedHistory,
    onSelectAllHistory,
    onSelectItemHistory,
}: JudgmentViewProps) {
    return (
        <div className="space-y-6 fade-in">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#323130]">Judgment History</h2>
                    <p className="text-sm text-[#605E5C]">Comprehensive archive of all inspection results and decisions</p>
                </div>
            </div>

            <div className="ms-card overflow-hidden bg-white">
                <div className="flex items-center justify-between p-4 border-b border-[#EDEBE9] bg-[#FAF9F8]">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#323130]">Inspection Records</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="ms-button ms-button-secondary h-9"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Data</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowJudgmentDateMenu(!showJudgmentDateMenu)}
                                className="ms-button ms-button-secondary h-9"
                            >
                                <CalendarRange className="w-4 h-4" />
                                <span className="hidden sm:inline">Filter by Date</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <AnimatePresence>
                                {showJudgmentDateMenu && (
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
                </div>

                <div className="p-0">
                    <JudgmentTable
                        results={paginatedJudgment}
                        selectedItems={selectedHistory}
                        onSelectAll={onSelectAllHistory}
                        onSelectItem={onSelectItemHistory}
                        onSort={requestJudgmentSort}
                        onItemClick={setShowDetailModal}
                    />
                </div>
                <div className="p-4 border-t border-[#EDEBE9] bg-[#FAF9F8]">
                    <PaginationFooter currentPage={judgmentPage} totalItems={processedJudgmentResults.length} itemsPerPage={itemsPerPage} onPageChange={setJudgmentPage} />
                </div>
            </div>
        </div>
    );
}
