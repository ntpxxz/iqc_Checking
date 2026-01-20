'use client';
import React from 'react';
import { Menu, Search } from 'lucide-react';

interface HeaderProps {
    setIsSidebarOpen: (isOpen: boolean) => void;
    filterText: string;
    setFilterText: (text: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen, filterText, setFilterText }) => (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu className="w-6 h-6" /></button>
            <div className="relative flex-1 md:w-96">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Search parts, lots, or GRN..." className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm font-medium border border-transparent focus:border-slate-200 rounded-lg transition-colors text-slate-700" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm text-sm">JD</div>
        </div>
    </header>
);
