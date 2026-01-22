'use client';

import React from 'react';
import { JudgmentView } from '@/components/features/judgment/JudgmentView';
import { InspectionRecord } from '@/types';

interface HistoryLayoutProps {
    itemsPerPage: number;
    setShowDetailModal: (item: InspectionRecord | null) => void;

    // Judgment Props (Passed through to JudgmentView)
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
    itemsPerPage,
    setShowDetailModal,
    ...judgmentProps
}: HistoryLayoutProps) {
    return (
        <div className="space-y-6 fade-in">
            <JudgmentView
                {...judgmentProps}
                itemsPerPage={itemsPerPage}
                setShowDetailModal={setShowDetailModal}
            />
        </div>
    );
}
