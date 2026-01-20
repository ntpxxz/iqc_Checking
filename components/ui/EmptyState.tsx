import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    message: string;
    subMessage: string;
    icon: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
            <Icon className="w-10 h-10 text-slate-300" />
        </div>
        <p className="text-lg font-semibold text-slate-600">{message}</p>
        <p className="text-sm">{subMessage}</p>
    </div>
);
