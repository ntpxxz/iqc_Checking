'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryTable } from '@/components/tables/HistoryTable';
import { JudgmentView } from '@/components/features/judgment/JudgmentView';
import { HistoryItem } from '@/types';
import { PaginationFooter } from '@/components/ui/Pagination';

interface HistoryLayoutProps {
    // History Props
    recentHistory: HistoryItem[];
    historyPage: number;
    setHistoryPage: (page: number) => void;
    itemsPerPage: number;
    setShowDetailModal: (item: HistoryItem | null) => void;

    // Judgment Props (Passed through to JudgmentView)
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
    requestJudgmentSort: (key: string) => void;
}

export function HistoryLayout({
    recentHistory,
    historyPage,
    setHistoryPage,
    itemsPerPage,
    setShowDetailModal,
    ...judgmentProps
}: HistoryLayoutProps) {
    const [activeTab, setActiveTab] = useState<'recent' | 'judgment'>('recent');

    return (
        <div className="space-y-6 fade-in">
            <div className="flex items-center justify-between">
                <div className="flex bg-[#F3F2F1] p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('recent')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'recent' ? 'bg-white text-[#323130] shadow-sm' : 'text-[#605E5C] hover:text-[#323130]'}`}
                    >
                        Recent Inspections
                    </button>
                    <button
                        onClick={() => setActiveTab('judgment')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'judgment' ? 'bg-white text-[#323130] shadow-sm' : 'text-[#605E5C] hover:text-[#323130]'}`}
                    >
                        Judgment Records
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'recent' ? (
                    <motion.div
                        key="recent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-[#323130]">Recent Inspections</h2>
                            <p className="text-sm text-[#605E5C]">Live feed of all inspection activities</p>
                        </div>

                        <div className="ms-card overflow-hidden bg-white">
                            <div className="p-0">
                                <HistoryTable
                                    history={recentHistory}
                                    onItemClick={setShowDetailModal}
                                />
                            </div>
                            <div className="p-4 border-t border-[#EDEBE9] bg-[#FAF9F8]">
                                <PaginationFooter
                                    currentPage={historyPage}
                                    totalItems={recentHistory.length} // Note: This might need total count if paginated on server, but assuming client side for now based on DashboardView
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setHistoryPage}
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="judgment"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <JudgmentView {...judgmentProps} itemsPerPage={itemsPerPage} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
