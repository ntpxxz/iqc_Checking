import React from 'react';

interface TableSkeletonProps {
    cols?: number;
    rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ cols = 5, rows = 5 }) => (
    <div className="animate-pulse w-full">
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border-b border-slate-100">
                {[...Array(cols)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-200 rounded w-full"></div>
                ))}
            </div>
        ))}
    </div>
);
