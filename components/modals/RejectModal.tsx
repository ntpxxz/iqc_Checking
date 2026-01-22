'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (remark: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [remark, setRemark] = useState('');

    const handleConfirm = () => {
        onConfirm(remark);
        setRemark(''); // Reset after confirm
    };

    return (
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
                        className="bg-white shadow-2xl max-w-sm w-full p-8 text-center relative z-10 rounded-sm border border-[#EDEBE9]"
                    >
                        <div className="w-16 h-16 bg-[#FDE7E9] text-[#A4262C] rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>

                        <h3 className="text-lg font-semibold text-[#323130] mb-2">Confirm Rejection</h3>
                        <p className="text-sm text-[#605E5C] mb-6 leading-relaxed">
                            Are you sure you want to mark this lot as <span className="font-semibold text-[#A4262C]">Quarantine</span>? This action will be logged in the system.
                        </p>

                        <div className="mb-6 text-left">
                            <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider block mb-1">Rejection Remark</label>
                            <textarea
                                className="ms-input w-full h-24 resize-none"
                                placeholder="Enter reason for rejection..."
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleConfirm}
                                disabled={!remark.trim()}
                                className={`ms-button bg-[#A4262C] text-white hover:bg-[#841D22] h-10 ${!remark.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Reject Lot
                            </button>
                            <button
                                onClick={onClose}
                                className="ms-button ms-button-secondary h-10"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
