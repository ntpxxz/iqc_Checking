import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    colorClass: string;
    trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            {trend && <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">↑ {trend} vs yesterday</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);
