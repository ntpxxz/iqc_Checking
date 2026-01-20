import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationFooterProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1 && totalItems > 0) return <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">Showing all {totalItems} results</div>;
    if (totalItems === 0) return null;
    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
                <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 text-slate-600"><ChevronRight className="w-4 h-4" /></button>
            </div>
        </div>
    );
};
