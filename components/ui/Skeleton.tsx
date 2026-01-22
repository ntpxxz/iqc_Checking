import React from 'react';

interface TableSkeletonProps {
    cols?: number;
    rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ cols = 5, rows = 5 }) => (
    <div className="animate-pulse w-full bg-white">
        <div className="flex items-center bg-[#FAF9F8] h-10 px-4 border-b border-[#EDEBE9]">
            {[...Array(cols)].map((_, j) => (
                <div key={j} className="flex-1 px-2">
                    <div className="h-2 bg-[#EDEBE9] rounded-sm w-1/2"></div>
                </div>
            ))}
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center h-12 px-4 border-b border-[#EDEBE9] last:border-0">
                {[...Array(cols)].map((_, j) => (
                    <div key={j} className="flex-1 px-2">
                        <div className="h-2.5 bg-[#F3F2F1] rounded-sm w-3/4"></div>
                    </div>
                ))}
            </div>
        ))}
    </div>
);
