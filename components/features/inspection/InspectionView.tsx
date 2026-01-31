'use client';

import React from 'react';
import {
    Box, Truck, ShieldCheck, Ban, CheckCircle2, ChevronLeft, Info, FileText, Package
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
        <div className="max-w-6xl mx-auto space-y-6 fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={returnToDashboard}
                        className="ms-button ms-button-secondary"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <h2 className="text-xl font-bold text-[#323130]">Inspection Job</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#605E5C] uppercase tracking-wider">Status:</span>
                    <span className="px-2 py-0.5 bg-[#DEECF9] text-[#0078D4] text-[10px] font-bold rounded-full uppercase">
                        {activeJob.iqcStatus}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Details Card */}
                    <div className="ms-card p-6">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#F3F2F1] rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-[#323130]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#323130]">{activeJob.part}</h3>
                                    <p className="text-sm text-[#605E5C]">{activeJob.partName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Lot IQC</p>
                                <p className="font-mono text-sm font-bold text-[#323130]">{activeJob.lotNo}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[#EDEBE9]">
                            <div>
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Quantity</label>
                                <p className="text-xl font-bold text-[#323130]">{activeJob.qty.toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Revision</label>
                                <p className="text-sm font-bold text-[#323130]">{activeJob.rev}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Supplier</label>
                                <p className="text-sm font-bold text-[#323130] flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-[#605E5C]" />
                                    {activeJob.vendor}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Invoice</label>
                                <p className="text-sm font-bold text-[#323130]">{activeJob.invoice}</p>
                            </div>
                        </div>
                    </div>

                    {/* Protocol Card */}
                    <div className="ms-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#DFF6DD] rounded-lg flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-[#107C41]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#323130]">Sampling Protocol</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg">
                                <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider mb-1">Sample Size</p>
                                <p className="text-2xl font-bold text-[#323130]">{activeJob.requirements?.sampleSize}</p>
                            </div>
                            <div className="p-4 bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg">
                                <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider mb-1">Accept Limit</p>
                                <p className="text-2xl font-bold text-[#323130]">{activeJob.requirements?.majorLimit}</p>
                            </div>
                            <div className="p-4 bg-[#FAF9F8] border border-[#EDEBE9] rounded-lg">
                                <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider mb-1">Code</p>
                                <p className="text-2xl font-bold text-[#323130]">{activeJob.requirements?.code}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Decision Card */}
                    <div className="ms-card p-6 flex flex-col h-full border-t-4 border-t-[#ffe500]">
                        <h3 className="text-lg font-bold text-[#323130] mb-6">Inspection Verdict</h3>

                        <div className="space-y-3 flex-1">
                            <button
                                onClick={() => setManualVerdict('PASS')}
                                className={`w-full flex items-center gap-4 p-4 border-2 transition-all rounded-xl ${manualVerdict === 'PASS' ? 'bg-[#DFF6DD] border-[#107C41] text-[#107C41]' : 'bg-white border-[#EDEBE9] hover:border-[#ffe500]'}`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${manualVerdict === 'PASS' ? 'bg-[#107C41] text-white' : 'bg-[#F3F2F1] text-[#605E5C]'}`}>
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Accept Lot</p>
                                    <p className="text-xs opacity-80">Meets quality standards</p>
                                </div>
                            </button>

                            <button
                                onClick={handleRejectClick}
                                className={`w-full flex items-center gap-4 p-4 border-2 transition-all rounded-xl ${manualVerdict === 'FAIL' ? 'bg-[#FDE7E9] border-[#A4262C] text-[#A4262C]' : 'bg-white border-[#EDEBE9] hover:border-[#ffe500]'}`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${manualVerdict === 'FAIL' ? 'bg-[#A4262C] text-white' : 'bg-[#F3F2F1] text-[#605E5C]'}`}>
                                    <Ban className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Reject Lot</p>
                                    <p className="text-xs opacity-80">Fails requirements</p>
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#EDEBE9] space-y-4">
                            <button
                                onClick={() => submitInspection(null)}
                                disabled={!manualVerdict || manualVerdict === 'FAIL'}
                                className={`w-full ms-button ms-button-primary h-12 rounded-xl text-base ${(!manualVerdict || manualVerdict === 'FAIL') ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                Confirm Inspection
                            </button>
                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">
                                <Info className="w-3 h-3" />
                                Logged as Jane Doe
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
