'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Ban } from 'lucide-react';
import { HistoryItem } from '@/types';

interface DetailModalProps {
    item: HistoryItem | null;
    onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => (
    <AnimatePresence>
        {item && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Inspection Certificate</h3>
                            <p className="text-sm text-slate-500 font-mono">{item.lotNo}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Verdict</p>
                                <div className={`flex items-center gap-2 font-bold text-lg ${item.status === 'RELEASED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {item.status === 'RELEASED' ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                                    {item.status}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                                <p className="font-bold text-slate-700">{item.date}</p>
                                <p className="text-xs text-slate-500">{item.time}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-slate-500 font-bold mb-1">Part Name</p><p className="text-sm font-medium">{item.partName}</p></div>
                            <div><p className="text-xs text-slate-500 font-bold mb-1">Part Number</p><p className="text-sm font-medium">{item.part}</p></div>
                            <div><p className="text-xs text-slate-500 font-bold mb-1">Vendor</p><p className="text-sm font-medium">{item.vendor}</p></div>
                            <div><p className="text-xs text-slate-500 font-bold mb-1">Inspector</p><p className="text-sm font-medium">{item.inspector}</p></div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                        <button onClick={onClose} className="px-6 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 shadow-sm text-sm">Close</button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
