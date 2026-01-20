'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm }) => (
    <AnimatePresence>
        {isOpen && (
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
                    className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 text-center relative z-10 border border-slate-100"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <AlertTriangle className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Confirm Rejection</h3>
                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                        Are you sure you want to mark this lot as <br />
                        <span className="text-rose-600 font-black uppercase tracking-wider">Quarantine</span>?
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 rounded-2xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all active:scale-95"
                        >
                            Yes, Reject Lot
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
