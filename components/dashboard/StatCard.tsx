'use client';
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    colorClass?: string;
    trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, colorClass = "text-[#0078D4]", trend }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="ms-card p-5 flex flex-col justify-between bg-white"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-[#F3F2F1] flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FDE7E9] text-[#A4262C]'}`}>
                    {trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#323130]">{value}</p>
        </div>
    </motion.div>
);
