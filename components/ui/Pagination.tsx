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

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <p className="text-sm text-[#605E5C]">
                Showing <span className="font-bold text-[#323130]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-[#323130]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold text-[#323130]">{totalItems.toLocaleString()}</span> results
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 flex items-center justify-center rounded-lg border border-[#EDEBE9] text-[#323130] hover:bg-white hover:shadow-md disabled:opacity-20 disabled:shadow-none transition-all duration-200"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                    {getPageNumbers().map((page, i) => (
                        <React.Fragment key={i}>
                            {page === '...' ? (
                                <span className="px-2 text-[#A19F9D]">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 ${currentPage === page
                                            ? 'bg-[#ffe500] text-[#323130] shadow-sm transform scale-110 active:scale-95'
                                            : 'text-[#605E5C] hover:bg-white hover:text-[#323130] hover:shadow-sm active:scale-95'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 flex items-center justify-center rounded-lg border border-[#EDEBE9] text-[#323130] hover:bg-white hover:shadow-md disabled:opacity-20 disabled:shadow-none transition-all duration-200"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
