'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Rejection</h3>
                    <p className="text-slate-500 mb-6">Mark this lot as <strong className="text-rose-600">QUARANTINE</strong>?</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onClose} className="py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                        <button onClick={onConfirm} className="py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors">Yes, Reject</button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
