'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, X, LayoutGrid, Gavel, Settings, LogOut, ChevronRight, HelpCircle, Users } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    view: string;
    setView: (view: string) => void;
}

const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutGrid },
    { id: 'JUDGMENT', label: 'Judgment Result', icon: Gavel },
];

const controlItems = [
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, view, setView }) => (
    <>
        <AnimatePresence>
            {isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </AnimatePresence>

        <div className={`fixed left-0 top-0 h-screen bg-white flex flex-col z-50 transition-all duration-300 w-64 border-r border-slate-100 shadow-sm ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Logo Section */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2.5 rounded-xl shadow-sm">
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-lg text-slate-800 tracking-tight">QualiTrack</span>
                        <span className="block text-[10px] text-slate-400 font-medium -mt-0.5">IQC System</span>
                    </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 py-4 px-3 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work</p>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${isActive
                                        ? 'bg-yellow-50 text-yellow-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-yellow-100' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-600' : 'text-slate-500'}`} />
                                </div>
                                <span className="flex-1 text-left">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 text-yellow-500" />}
                            </button>
                        );
                    })}
                </nav>

                <p className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Control</p>
                <nav className="space-y-1">
                    {controlItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${isActive
                                        ? 'bg-yellow-50 text-yellow-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-yellow-100' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-600' : 'text-slate-500'}`} />
                                </div>
                                <span className="flex-1 text-left">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 text-yellow-500" />}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-3 border-t border-slate-100">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium group"
                >
                    <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    </>
);
