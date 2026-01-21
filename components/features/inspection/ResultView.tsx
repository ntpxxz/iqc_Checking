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
            className="flex flex-col items-center justify-center py-12 md:py-24 max-w-2xl mx-auto"
        >
            <div className="relative mb-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", damping: 12 }} className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 ${verdict === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-rose-500 text-white shadow-rose-200'}`}>
                    {verdict === 'PASS' ? <CheckCircle2 className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className={`absolute inset-0 -m-4 rounded-[3rem] border-2 ${verdict === 'PASS' ? 'border-emerald-200' : 'border-rose-200'}`}></motion.div>
            </div>

            <div className="text-center space-y-4 mb-12">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-black text-slate-900 tracking-tight">Inspection Complete</motion.h1>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-slate-500 font-medium">The lot has been successfully processed and marked as <br /><span className={`font-black uppercase tracking-wider ${verdict === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>{verdict === 'PASS' ? 'RELEASED TO WAREHOUSE' : 'QUARANTINED'}</span></motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm w-full mb-12 grid grid-cols-2 gap-8">
                <div className="space-y-1"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Lot Number</span><span className="font-mono font-bold text-slate-700">{activeJob?.lotNo}</span></div>
                <div className="space-y-1 text-right"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Timestamp</span><span className="font-bold text-slate-700">{new Date().toLocaleTimeString()}</span></div>
                <div className="space-y-1"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Part Number</span><span className="font-bold text-slate-700">{activeJob?.part}</span></div>
                <div className="space-y-1 text-right"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Inspector</span><span className="font-bold text-slate-700">Jane Doe</span></div>
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={returnToDashboard} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-3">
                <LayoutGrid className="w-5 h-5" /> Return to Dashboard
            </motion.button>
        </motion.div>
    );
}
