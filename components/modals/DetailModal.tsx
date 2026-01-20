'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Ban, Calendar, Clock, User, Truck, Package, Hash } from 'lucide-react';
import { HistoryItem } from '@/types';

interface DetailModalProps {
    item: HistoryItem | null;
    onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => (
    <AnimatePresence>
        {item && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-0 overflow-hidden relative z-10 border border-slate-100"
                >
                    {/* Header */}
                    <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inspection Certificate</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Hash className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-sm font-mono font-bold text-slate-500">{item.lotNo}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        {/* Status Card */}
                        <div className="flex justify-between items-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Verdict</p>
                                <div className={`flex items-center gap-2 font-black text-xl ${item.status === 'RELEASED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {item.status === 'RELEASED' ? <CheckCircle2 className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
                                    {item.status}
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspection Date</p>
                                <div className="flex items-center justify-end gap-2 font-bold text-slate-700">
                                    <Calendar className="w-4 h-4 text-slate-300" />
                                    {item.date}
                                </div>
                                <div className="flex items-center justify-end gap-2 text-xs text-slate-400 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                                    {item.time}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Package className="w-3 h-3" />
                                    Part Details
                                </div>
                                <p className="text-sm font-bold text-slate-800">{item.part}</p>
                                <p className="text-[11px] text-slate-500 font-medium leading-tight">{item.partName}</p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Truck className="w-3 h-3" />
                                    Supplier
                                </div>
                                <p className="text-sm font-bold text-slate-800">{item.vendor}</p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <User className="w-3 h-3" />
                                    Inspector
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {item.inspector.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{item.inspector}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Hash className="w-3 h-3" />
                                    Quantity
                                </div>
                                <p className="text-sm font-bold text-slate-800">{item.qty.toLocaleString()} units</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 text-sm"
                        >
                            Close Certificate
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
