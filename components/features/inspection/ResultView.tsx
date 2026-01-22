'use client';

import React from 'react';
import {
    LayoutGrid, FileCheck, FileX
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface ResultViewProps {
    verdict: string | null;
    activeJob: Task | null;
    returnToDashboard: () => void;
}

export function ResultView({
    verdict,
    activeJob,
    returnToDashboard,
}: ResultViewProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto fade-in">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ms-card p-10 w-full flex flex-col items-center text-center bg-white border-t-8 border-t-[#ffe500]"
            >
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${verdict === 'PASS' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FDE7E9] text-[#A4262C]'}`}>
                    {verdict === 'PASS' ? <FileCheck className="w-12 h-12" /> : <FileX className="w-12 h-12" />}
                </div>

                <h1 className="text-3xl font-bold text-[#323130] mb-2">Inspection Complete</h1>
                <p className="text-[#605E5C] mb-10">The result has been successfully logged and archived in the system.</p>

                <div className={`w-full p-5 rounded-xl border-2 mb-10 ${verdict === 'PASS' ? 'bg-[#DFF6DD] border-[#107C41]/20 text-[#107C41]' : 'bg-[#FDE7E9] border-[#A4262C]/20 text-[#A4262C]'}`}>
                    <p className="text-sm font-bold uppercase tracking-widest">
                        {verdict === 'PASS' ? 'Lot Released to Warehouse' : 'Lot Quarantined'}
                    </p>
                </div>

                <div className="w-full grid grid-cols-2 gap-8 text-left border-t border-[#EDEBE9] pt-10 mb-10">
                    <div>
                        <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Lot Number</span>
                        <span className="font-mono text-sm font-bold text-[#323130]">{activeJob?.lotNo}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1 text-right">Part Number</span>
                        <span className="text-sm font-bold text-[#323130] block text-right">{activeJob?.part}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Timestamp</span>
                        <span className="text-sm font-bold text-[#323130]">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1 text-right">Inspector</span>
                        <span className="text-sm font-bold text-[#323130] block text-right">Jane Doe</span>
                    </div>
                </div>

                <button
                    onClick={returnToDashboard}
                    className="ms-button ms-button-primary w-full h-12 rounded-xl text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                    <LayoutGrid className="w-5 h-5" />
                    Return to Dashboard
                </button>
            </motion.div>
        </div>
    );
}
