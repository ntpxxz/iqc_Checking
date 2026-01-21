'use client';

import React from 'react';
import {
    Box, Truck, MapPin, User, CalendarRange, ShieldCheck, Ban, Check, CheckCircle2, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface InspectionViewProps {
    activeJob: Task;
    manualVerdict: string | null;
    setManualVerdict: (verdict: string | null) => void;
    returnToDashboard: () => void;
    handleRejectClick: () => void;
    submitInspection: (verdict: string | null) => void;
}

export function InspectionView({
    activeJob,
    manualVerdict,
    setManualVerdict,
    returnToDashboard,
    handleRejectClick,
    submitInspection,
}: InspectionViewProps) {
    return (
        <motion.div
            key="inspect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
            {/* Left Column: Info Panel */}
            <div className="lg:col-span-5 space-y-6">
                <motion.button whileHover={{ x: -4 }} onClick={returnToDashboard} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
                    <Box className="w-4 h-4 group-hover:scale-110 transition-transform" /> Back to Dashboard
                </motion.button>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-3">{activeJob.inspectionType}</span>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{activeJob.part}</h3>
                                <p className="text-lg text-slate-500 font-medium">{activeJob.partName}</p>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200"><Box className="w-8 h-8 text-white" /></div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Lot IQC</label><p className="font-mono text-base font-bold text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl inline-block border border-indigo-100/50">{activeJob.lotNo}</p></div>
                            <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Quantity</label><p className="text-xl font-black text-slate-900">{activeJob.qty.toLocaleString()}</p></div>
                            <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Vendor</label><p className="text-base font-bold text-slate-700 flex items-center gap-2"><Truck className="w-4 h-4 text-slate-300" />{activeJob.vendor}</p></div>
                            <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Revision</label><p className="text-base font-bold text-slate-700">{activeJob.rev}</p></div>
                        </div>

                        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CalendarRange className="w-3 h-3" /> Receiving Logistics</h4>
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Invoice</span><span className="font-bold text-slate-700 text-sm">{activeJob.invoice}</span></div>
                                <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Mfg Date</span><span className="font-bold text-slate-700 text-sm">{activeJob.mfgDate}</span></div>
                                <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Location</span><span className="font-bold text-slate-700 text-sm flex items-center gap-1.5"><MapPin className="w-3 h-3 text-indigo-400" />{activeJob.location}</span></div>
                                <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Receiver</span><span className="font-bold text-slate-700 text-sm flex items-center gap-1.5"><User className="w-3 h-3 text-indigo-400" />{activeJob.receiver}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[2rem] shadow-xl shadow-indigo-200 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Sampling Protocol</h3>
                        <div className="flex items-baseline gap-2 mb-2"><span className="text-5xl font-black">{activeJob.requirements?.sampleSize}</span><span className="text-xl font-medium text-indigo-200">units</span></div>
                        <p className="text-sm text-indigo-100/80 font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> ISO 2859-1 (Level II, Code {activeJob.requirements?.code})</p>
                    </div>
                    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></motion.div>
                </motion.div>
            </div>

            {/* Right Column: Decision Panel */}
            <div className="lg:col-span-7">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white h-full flex flex-col p-10 md:p-16 relative overflow-hidden">
                    <div className="text-center relative z-10 mb-12">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Final Inspection Decision</h2>
                        <p className="text-slate-500 max-w-md mx-auto">Please evaluate the lot based on the sampling results and select the appropriate action.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                        <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setManualVerdict('PASS')} className={`relative group flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 transition-all duration-500 ${manualVerdict === 'PASS' ? 'bg-emerald-50 border-emerald-500 shadow-[0_20px_40px_rgba(16,185,129,0.15)]' : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'}`}>
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${manualVerdict === 'PASS' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}><ShieldCheck className="w-10 h-10" /></div>
                            <span className={`text-lg font-black tracking-tight transition-colors duration-500 ${manualVerdict === 'PASS' ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'}`}>ACCEPT LOT</span>
                            {manualVerdict === 'PASS' && <motion.div layoutId="active-indicator" className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg"><Check className="w-5 h-5" /></motion.div>}
                        </motion.button>

                        <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRejectClick} className={`relative group flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 transition-all duration-500 ${manualVerdict === 'FAIL' ? 'bg-rose-50 border-rose-500 shadow-[0_20px_40px_rgba(244,63,94,0.15)]' : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/30'}`}>
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${manualVerdict === 'FAIL' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 text-slate-300 group-hover:bg-rose-100 group-hover:text-rose-500'}`}><Ban className="w-10 h-10" /></div>
                            <span className={`text-lg font-black tracking-tight transition-colors duration-500 ${manualVerdict === 'FAIL' ? 'text-rose-700' : 'text-slate-400 group-hover:text-rose-600'}`}>REJECT LOT</span>
                            {manualVerdict === 'FAIL' && <motion.div layoutId="active-indicator" className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg"><XCircle className="w-5 h-5" /></motion.div>}
                        </motion.button>
                    </div>

                    <div className="mt-auto relative z-10">
                        <motion.button whileHover={manualVerdict === 'PASS' ? { scale: 1.02, y: -2 } : {}} whileTap={manualVerdict === 'PASS' ? { scale: 0.98 } : {}} onClick={() => submitInspection(null)} disabled={!manualVerdict || manualVerdict === 'FAIL'} className={`w-full py-6 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 ${manualVerdict === 'PASS' ? 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                            {manualVerdict === 'PASS' ? <><CheckCircle2 className="w-6 h-6" /> Confirm Reject</> : 'Select a Decision'}
                        </motion.button>
                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Action will be logged for inspector: <span className="text-slate-600">Jane Doe</span></p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
