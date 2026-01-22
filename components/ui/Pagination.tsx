'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationFooterProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between">
            <p className="text-xs text-[#605E5C]">
                Showing <span className="font-semibold text-[#323130]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-[#323130]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold text-[#323130]">{totalItems}</span> results
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#EDEBE9] text-[#605E5C] hover:bg-[#F3F2F1] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onPageChange(i + 1)}
                            className={`w-8 h-8 rounded-sm text-xs font-semibold transition-all ${currentPage === i + 1 ? 'bg-[#0078D4] text-white' : 'text-[#605E5C] hover:bg-[#F3F2F1]'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#EDEBE9] text-[#605E5C] hover:bg-[#F3F2F1] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
