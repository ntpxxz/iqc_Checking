import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    message: string;
    subMessage: string;
    icon: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-50 p-6 rounded-[2rem] mb-6 border border-slate-100 shadow-sm"
        >
            <Icon className="w-12 h-12 text-slate-200" />
        </motion.div>
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
        >
            <p className="text-xl font-bold text-slate-800 mb-2">{message}</p>
            <p className="text-sm text-slate-400 font-medium max-w-[250px] mx-auto leading-relaxed">{subMessage}</p>
        </motion.div>
    </div>
);
