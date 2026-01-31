'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Ban, Calendar, Clock, User, Truck, Package, Hash, FileText } from 'lucide-react';
import { InspectionRecord } from '@/types';

interface DetailModalProps {
    item: InspectionRecord | null;
    onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
    if (!item) return null;

    const status = item.status || (item.judgment === 'PASS' ? 'PASSED' : 'REJECTED');
    const isPassed = status === 'PASSED';
    const lotNo = item.lotIqc;
    const part = item.partNo;
    const vendor = item.supplier;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.98, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 10 }}
                    className="bg-white shadow-2xl max-w-xl w-full rounded-sm overflow-hidden relative z-10 border border-[#EDEBE9]"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-[#EDEBE9] flex justify-between items-center bg-[#FAF9F8]">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0078D4]" />
                            <h3 className="text-sm font-semibold text-[#323130]">Inspection Record</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#EDEBE9] text-[#605E5C] rounded-sm transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Status Card */}
                        <div className={`p-4 rounded-sm border flex justify-between items-center ${isPassed ? 'bg-[#DFF6DD] border-[#107C41]/20 text-[#107C41]' : 'bg-[#FDE7E9] border-[#A4262C]/20 text-[#A4262C]'}`}>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 opacity-80">Final Verdict</p>
                                <div className="flex items-center gap-2 font-semibold text-xl">
                                    {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
                                    {status}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 opacity-80">Lot IQC</p>
                                <p className="font-mono font-semibold text-sm">{lotNo}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-[#605E5C] uppercase tracking-wider block">Part Details</label>
                                <p className="text-sm font-semibold text-[#323130]">{part}</p>
                                <p className="text-xs text-[#605E5C]">{item.partName}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-[#605E5C] uppercase tracking-wider block">Supplier</label>
                                <p className="text-sm font-semibold text-[#323130] flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-[#605E5C]" />
                                    {vendor}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-[#605E5C] uppercase tracking-wider block">Inspector</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-[#F3F2F1] rounded-full flex items-center justify-center text-[10px] font-semibold text-[#605E5C]">
                                        {item.inspector.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <p className="text-sm text-[#323130]">{item.inspector}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-[#605E5C] uppercase tracking-wider block">Quantity</label>
                                <p className="text-sm font-semibold text-[#323130]">{item.qty.toLocaleString()} units</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#EDEBE9] flex items-center gap-4 text-xs text-[#605E5C]">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {item.date}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {item.time || '00:00'}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-[#FAF9F8] border-t border-[#EDEBE9] flex justify-end">
                        <button
                            onClick={onClose}
                            className="ms-button ms-button-primary px-8"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
