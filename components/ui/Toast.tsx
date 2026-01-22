'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';
import { Toast as ToastType } from '@/types';

interface ToastContainerProps {
    toasts: ToastType[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
    return (
        <div className="fixed top-14 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white border border-[#EDEBE9] p-4 shadow-lg flex items-start gap-3 rounded-sm relative group"
                    >
                        <div className={`shrink-0 mt-0.5 ${t.type === 'success' ? 'text-[#107C41]' :
                            t.type === 'error' ? 'text-[#A4262C]' :
                                t.type === 'warning' ? 'text-[#D83B01]' : 'text-[#0078D4]'
                            }`}>
                            {t.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                                t.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                    t.type === 'warning' ? <Bell className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-[#323130] leading-tight">{t.message}</p>
                            <p className="text-[10px] text-[#605E5C] uppercase tracking-wider mt-1 font-semibold">System Notification</p>
                        </div>
                        <button className="text-[#605E5C] hover:text-[#323130] opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
