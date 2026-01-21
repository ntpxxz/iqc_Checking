'use client';
import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    colorClass: string;
    trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, colorClass, trend }) => (
    <motion.div
        whileHover={{ x: -4, y: -4, boxShadow: '8px 8px 0px #000000' }}
        className="bg-white p-6 border-[3px] border-black shadow-[4px_4px_0px_black] flex items-start justify-between group transition-all cursor-default"
    >
        <div className="flex-1">
            <p className="text-[11px] font-black text-black uppercase tracking-[0.1em] mb-3">{label}</p>
            <h3 className="text-4xl font-black text-black mb-2 tracking-tighter">{value}</h3>
            {trend && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-success border-2 border-black text-[10px] font-black uppercase">
                    <TrendingUp className="w-3 h-3" />
                    <span>{trend} UP</span>
                </div>
            )}
        </div>
        <div className={`p-4 border-[3px] border-black shadow-[3px_3px_0px_black] bg-primary group-hover:bg-secondary transition-colors`}>
            <Icon className="w-6 h-6 text-black" />
        </div>
    </motion.div>
);
