'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, QrCode, Printer } from 'lucide-react';

interface PrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrint: () => void;
    isPrinting: boolean;
    itemCount: number;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, onPrint, isPrinting, itemCount }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Print Labels</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="flex flex-col items-center gap-4 py-6 border-y border-slate-100 mb-6">
                        <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden relative">
                            {isPrinting ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                    <Loader2 className="w-12 h-12 text-yellow-500" />
                                </motion.div>
                            ) : (
                                <QrCode className="w-16 h-16 text-slate-400" />
                            )}
                        </div>
                        <p className="text-center text-slate-500 text-sm">
                            {isPrinting ? 'Communicating with printer...' : (
                                <>Generating labels for <strong className="text-yellow-600">{itemCount}</strong> items...</>
                            )}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onClose} disabled={isPrinting} className="py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">Cancel</button>
                        <button onClick={onPrint} disabled={isPrinting} className="py-3 rounded-xl font-bold text-slate-900 bg-yellow-400 hover:bg-yellow-500 shadow-md transition-colors flex items-center justify-center gap-2 disabled:bg-yellow-200">
                            {isPrinting ? 'Printing...' : <><Printer className="w-4 h-4" /> Print Now</>}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
