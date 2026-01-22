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
                    className="bg-white shadow-2xl max-w-md w-full p-8 relative z-10 rounded-sm border border-[#EDEBE9]"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-[#323130]">Print Labels</h3>
                            <p className="text-[10px] font-semibold text-[#605E5C] uppercase tracking-wider mt-0.5">Thermal Printer Ready</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F2F1] text-[#605E5C] rounded-sm transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-6 py-10 bg-[#FAF9F8] border border-[#EDEBE9] rounded-sm mb-8">
                        <div className="w-24 h-24 bg-white rounded-sm flex items-center justify-center shadow-sm border border-[#EDEBE9]">
                            {isPrinting ? (
                                <Loader2 className="w-8 h-8 text-[#0078D4] animate-spin" />
                            ) : (
                                <QrCode className="w-12 h-12 text-[#C8C6C4]" />
                            )}
                        </div>

                        <div className="text-center px-6">
                            <p className="text-[#323130] font-semibold">
                                {isPrinting ? 'Communicating...' : `Print ${itemCount} Labels`}
                            </p>
                            <p className="text-xs text-[#605E5C] mt-1 leading-relaxed">
                                {isPrinting ? 'Please do not close this window' : 'Labels will be formatted for standard thermal printers'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onPrint}
                            disabled={isPrinting}
                            className="ms-button ms-button-primary h-10 disabled:opacity-50"
                        >
                            {isPrinting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Printing...
                                </>
                            ) : (
                                <>
                                    <Printer className="w-4 h-4" />
                                    Print Now
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isPrinting}
                            className="ms-button ms-button-secondary h-10 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);
