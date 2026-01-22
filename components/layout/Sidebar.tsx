'use client';
import React from 'react';
import {
    LayoutDashboard, ClipboardCheck, History, Settings,
    ChevronLeft, ChevronRight, Gavel, Package
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    view: string;
    setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    isSidebarOpen: _unused, // Keep for compatibility if needed elsewhere
    view,
    setView
}) => {
    const menuItems = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'INSPECT', label: 'Inspection', icon: ClipboardCheck },
        { id: 'JUDGMENT', label: 'Judgment', icon: Gavel },
        { id: 'HISTORY', label: 'History', icon: History },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? 240 : 72 }}
            className="bg-white border-r border-[#EDEBE9] flex flex-col h-screen sticky top-0 z-40 overflow-hidden"
        >
            <div className="flex-1 py-4 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = view === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`w-full flex items-center gap-3 px-3 h-11 rounded-lg transition-all relative group ${isActive
                                    ? 'bg-[#ffe500] text-[#323130] shadow-sm'
                                    : 'text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#323130]'
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#323130]' : 'group-hover:text-[#323130]'}`} />

                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm font-semibold whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-6 bg-[#323130] rounded-r-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 border-t border-[#EDEBE9]">
                <div className={`flex items-center gap-3 px-2 ${!isSidebarOpen && 'justify-center'}`}>
                    <div className="w-8 h-8 bg-[#F3F2F1] rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-[#605E5C]" />
                    </div>
                    {isSidebarOpen && (
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-[#323130] truncate">Warehouse A</p>
                            <p className="text-[10px] text-[#605E5C] truncate">Main Terminal</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
