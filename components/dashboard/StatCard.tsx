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
        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group transition-all duration-300 cursor-default"
    >
        <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{trend} vs yesterday</span>
                </div>
            )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
        </div>
    </motion.div>
);
