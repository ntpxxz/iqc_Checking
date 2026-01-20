import React from 'react';

interface TableSkeletonProps {
    cols?: number;
    rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ cols = 5, rows = 5 }) => (
    <div className="animate-pulse w-full">
        <div className="flex items-center space-x-6 px-6 py-4 border-b border-slate-100">
            {[...Array(cols)].map((_, j) => (
                <div key={j} className="h-3 bg-slate-100 rounded-full w-full"></div>
            ))}
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center space-x-6 px-6 py-6 border-b border-slate-50">
                {[...Array(cols)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-50 rounded-xl w-full"></div>
                ))}
            </div>
        ))}
    </div>
);
