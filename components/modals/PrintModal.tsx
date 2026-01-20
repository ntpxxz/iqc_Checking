'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, QrCode, Printer, CheckCircle2 } from 'lucide-react';

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
                    className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative z-10 border border-slate-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Print Labels</h3>
                            <p className="text-sm text-slate-400 font-medium mt-1">Ready to generate IQC labels</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-6 py-10 bg-slate-50/50 rounded-[2rem] border border-slate-100 mb-8 relative overflow-hidden">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 relative z-10">
                                {isPrinting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Loader2 className="w-12 h-12 text-yellow-500" />
                                    </motion.div>
                                ) : (
                                    <QrCode className="w-16 h-16 text-slate-300" />
                                )}
                            </div>
                            {!isPrinting && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </motion.div>
                            )}
                        </div>

                        <div className="text-center px-6">
                            <p className="text-slate-600 font-bold">
                                {isPrinting ? 'Communicating with printer...' : (
                                    <>Generating labels for <span className="text-yellow-600 font-black">{itemCount}</span> items</>
                                )}
                            </p>
                            <p className="text-xs text-slate-400 mt-2 font-medium">
                                {isPrinting ? 'Please do not close this window' : 'Labels will be formatted for standard thermal printers'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onPrint}
                            disabled={isPrinting}
                            className="w-full py-4 rounded-2xl font-black text-slate-900 bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-100 transition-all flex items-center justify-center gap-3 disabled:bg-yellow-100 disabled:text-yellow-400 active:scale-95"
                        >
                            {isPrinting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Printing...
                                </>
                            ) : (
                                <>
                                    <Printer className="w-5 h-5" />
                                    Print Now
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isPrinting}
                            className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
