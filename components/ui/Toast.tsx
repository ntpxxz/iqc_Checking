'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';
import { Toast as ToastType } from '@/types';

interface ToastContainerProps {
    toasts: ToastType[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.8 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${t.type === 'success' ? 'bg-emerald-600' :
                                t.type === 'error' ? 'bg-rose-600' :
                                    t.type === 'warning' ? 'bg-amber-500' : 'bg-slate-800'
                            }`}
                    >
                        {t.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                            t.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                t.type === 'warning' ? <Bell className="w-5 h-5 animate-pulse" /> : <Info className="w-5 h-5" />}
                        <span>{t.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
