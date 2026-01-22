'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    message: string;
    subMessage?: string;
    icon: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage, icon: Icon }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
        <div className="w-20 h-20 bg-[#F3F2F1] rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <Icon className="w-10 h-10 text-[#C8C6C4]" />
        </div>
        <h3 className="text-lg font-bold text-[#323130] mb-2">{message}</h3>
        {subMessage && <p className="text-sm text-[#605E5C] max-w-xs mx-auto">{subMessage}</p>}
        <button className="mt-8 ms-button ms-button-secondary rounded-xl px-6">
            Refresh View
        </button>
    </motion.div>
);
