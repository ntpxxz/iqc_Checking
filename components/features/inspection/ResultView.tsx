'use client';

import React from 'react';
import {
    CheckCircle2, XCircle, LayoutGrid
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
        <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="flex flex-col items-center justify-center py-12 md:py-24 max-w-3xl mx-auto"
        >
            <div className="relative mb-16">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 12 }}
                    className={`w-40 h-40 border-[6px] border-black flex items-center justify-center shadow-[12px_12px_0px_black] relative z-10 ${verdict === 'PASS' ? 'bg-success text-black' : 'bg-accent text-white'}`}
                >
                    {verdict === 'PASS' ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 -m-6 border-[4px] border-black ${verdict === 'PASS' ? 'bg-primary' : 'bg-accent/20'}`}
                ></motion.div>
            </div>

            <div className="text-center space-y-6 mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-black text-black tracking-tighter uppercase"
                >
                    Inspection Complete
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-black/60 font-black uppercase"
                >
                    The lot has been successfully processed and marked as <br />
                    <span className={`inline-block mt-3 px-6 py-2 border-[3px] border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_black] ${verdict === 'PASS' ? 'bg-success text-black' : 'bg-accent text-white'}`}>
                        {verdict === 'PASS' ? 'RELEASED TO WAREHOUSE' : 'QUARANTINED'}
                    </span>
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border-[3px] border-black p-10 shadow-[8px_8px_0px_black] w-full mb-16 grid grid-cols-2 gap-10"
            >
                <div className="space-y-2">
                    <span className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Lot Number</span>
                    <span className="font-black text-black text-lg uppercase">{activeJob?.lotNo}</span>
                </div>
                <div className="space-y-2 text-right">
                    <span className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Timestamp</span>
                    <span className="font-black text-black text-lg uppercase">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="space-y-2">
                    <span className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Part Number</span>
                    <span className="font-black text-black text-lg uppercase">{activeJob?.part}</span>
                </div>
                <div className="space-y-2 text-right">
                    <span className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Inspector</span>
                    <span className="font-black text-black text-lg uppercase">Jane Doe</span>
                </div>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ x: -4, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={returnToDashboard}
                className="bg-black text-white px-16 py-6 border-[4px] border-black font-black text-xl uppercase tracking-widest shadow-[8px_8px_0px_primary] hover:shadow-[12px_12px_0px_primary] transition-all flex items-center gap-4"
            >
                <LayoutGrid className="w-6 h-6" /> Return to Dashboard
            </motion.button>
        </motion.div>
    );
}
