'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
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
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${t.type === 'success' ? 'bg-emerald-600' :
                                t.type === 'error' ? 'bg-rose-600' : 'bg-slate-800'
                            }`}
                    >
                        {t.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                            t.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
