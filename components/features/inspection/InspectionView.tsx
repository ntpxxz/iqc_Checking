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
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
        >
            {/* Left Column: Info Panel */}
            <div className="lg:col-span-5 space-y-8">
                <button
                    onClick={returnToDashboard}
                    className="flex items-center gap-3 px-4 py-2 border-[3px] border-black bg-white font-black text-xs uppercase tracking-widest hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                    <Box className="w-4 h-4" /> BACK TO DASHBOARD
                </button>

                <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_black] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary border-l-[3px] border-b-[3px] border-black -mr-16 -mt-16 rotate-45"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <span className="inline-block px-3 py-1 border-2 border-black bg-secondary text-black text-[10px] font-black uppercase tracking-widest mb-4 shadow-[2px_2px_0px_black]">{activeJob.inspectionType}</span>
                                <h3 className="text-4xl font-black text-black tracking-tighter mb-2 uppercase">{activeJob.part}</h3>
                                <p className="text-lg text-black/60 font-black uppercase">{activeJob.partName}</p>
                            </div>
                            <div className="bg-black p-5 border-[3px] border-white shadow-[4px_4px_0px_black]"><Box className="w-8 h-8 text-primary" /></div>
                        </div>

                        <div className="grid grid-cols-2 gap-10 mb-12">
                            <div className="space-y-2">
                                <label className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Lot IQC</label>
                                <p className="font-black text-base text-black bg-primary px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_black] inline-block uppercase">{activeJob.lotNo}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Quantity</label>
                                <p className="text-3xl font-black text-black tracking-tighter">{activeJob.qty.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Vendor</label>
                                <p className="text-base font-black text-black flex items-center gap-2 uppercase"><Truck className="w-5 h-5 text-secondary" />{activeJob.vendor}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] text-black/40 font-black uppercase tracking-widest block">Revision</label>
                                <p className="text-base font-black text-black uppercase">{activeJob.rev}</p>
                            </div>
                        </div>

                        <div className="bg-f0f0f0 border-[3px] border-black p-6 shadow-[4px_4px_0px_black]">
                            <h4 className="text-[11px] font-black text-black uppercase tracking-widest mb-6 flex items-center gap-3"><CalendarRange className="w-4 h-4" /> Receiving Logistics</h4>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="flex flex-col gap-1"><span className="text-black/40 text-[10px] font-black uppercase">Invoice</span><span className="font-black text-black text-sm uppercase">{activeJob.invoice}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-black/40 text-[10px] font-black uppercase">Mfg Date</span><span className="font-black text-black text-sm uppercase">{activeJob.mfgDate}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-black/40 text-[10px] font-black uppercase">Location</span><span className="font-black text-black text-sm uppercase flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" />{activeJob.location}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-black/40 text-[10px] font-black uppercase">Receiver</span><span className="font-black text-black text-sm uppercase flex items-center gap-2"><User className="w-4 h-4 text-secondary" />{activeJob.receiver}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black text-white p-8 border-[3px] border-black shadow-[8px_8px_0px_primary] relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-4">Sampling Protocol</h3>
                        <div className="flex items-baseline gap-3 mb-3"><span className="text-6xl font-black text-white tracking-tighter">{activeJob.requirements?.sampleSize}</span><span className="text-xl font-black text-primary uppercase">units</span></div>
                        <p className="text-sm text-white/60 font-black uppercase flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-success" /> ISO 2859-1 (CODE {activeJob.requirements?.code})</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Decision Panel */}
            <div className="lg:col-span-7">
                <div className="bg-white border-[3px] border-black shadow-[12px_12px_0px_black] h-full flex flex-col p-10 md:p-16 relative overflow-hidden">
                    <div className="text-center relative z-10 mb-16">
                        <h2 className="text-4xl font-black text-black tracking-tighter mb-4 uppercase">Final Decision</h2>
                        <p className="text-black/60 font-bold uppercase text-sm max-w-md mx-auto">Evaluate the lot based on sampling results and select the final action.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 relative z-10">
                        <button
                            onClick={() => setManualVerdict('PASS')}
                            className={`relative group flex flex-col items-center justify-center p-12 border-[4px] transition-all ${manualVerdict === 'PASS' ? 'bg-success border-black shadow-[8px_8px_0px_black] -translate-x-2 -translate-y-2' : 'bg-white border-black hover:bg-success/20 hover:shadow-[8px_8px_0px_black] hover:-translate-x-2 hover:-translate-y-2'}`}
                        >
                            <div className={`w-24 h-24 border-[4px] border-black flex items-center justify-center mb-8 transition-all ${manualVerdict === 'PASS' ? 'bg-white text-black' : 'bg-f0f0f0 text-black group-hover:bg-white'}`}><ShieldCheck className="w-12 h-12" /></div>
                            <span className="text-xl font-black tracking-widest uppercase">Accept Lot</span>
                            {manualVerdict === 'PASS' && <div className="absolute -top-4 -right-4 w-10 h-10 bg-black border-[3px] border-white flex items-center justify-center text-white shadow-[4px_4px_0px_black]"><Check className="w-6 h-6" /></div>}
                        </button>

                        <button
                            onClick={handleRejectClick}
                            className={`relative group flex flex-col items-center justify-center p-12 border-[4px] transition-all ${manualVerdict === 'FAIL' ? 'bg-accent border-black shadow-[8px_8px_0px_black] -translate-x-2 -translate-y-2' : 'bg-white border-black hover:bg-accent/20 hover:shadow-[8px_8px_0px_black] hover:-translate-x-2 hover:-translate-y-2'}`}
                        >
                            <div className={`w-24 h-24 border-[4px] border-black flex items-center justify-center mb-8 transition-all ${manualVerdict === 'FAIL' ? 'bg-white text-black' : 'bg-f0f0f0 text-black group-hover:bg-white'}`}><Ban className="w-12 h-12" /></div>
                            <span className="text-xl font-black tracking-widest uppercase text-black">Reject Lot</span>
                            {manualVerdict === 'FAIL' && <div className="absolute -top-4 -right-4 w-10 h-10 bg-black border-[3px] border-white flex items-center justify-center text-white shadow-[4px_4px_0px_black]"><XCircle className="w-6 h-6" /></div>}
                        </button>
                    </div>

                    <div className="mt-auto relative z-10">
                        <button
                            onClick={() => submitInspection(null)}
                            disabled={!manualVerdict || manualVerdict === 'FAIL'}
                            className={`w-full py-8 border-[4px] border-black font-black text-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${manualVerdict === 'PASS' ? 'bg-black text-white shadow-[10px_10px_0px_primary] hover:shadow-none hover:translate-x-2 hover:translate-y-2' : 'bg-f0f0f0 text-black/20 cursor-not-allowed'}`}
                        >
                            {manualVerdict === 'PASS' ? <><CheckCircle2 className="w-8 h-8 text-primary" /> Confirm Release</> : 'Select Decision'}
                        </button>
                        <p className="text-center text-[11px] text-black/40 font-black uppercase tracking-[0.2em] mt-8">Inspector: <span className="text-black">Jane Doe</span></p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
