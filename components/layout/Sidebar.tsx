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
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </AnimatePresence>

        <div className={`fixed left-0 top-0 h-screen bg-white flex flex-col z-50 transition-all duration-300 w-64 border-r-[3px] border-black ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between border-b-[3px] border-black bg-primary">
                <div className="flex items-center gap-3">
                    <div className="bg-black p-2 border-2 border-white shadow-[2px_2px_0px_white]">
                        <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <span className="font-black text-xl text-black tracking-tighter uppercase">QualiTrack</span>
                        <span className="block text-[10px] text-black font-bold -mt-1 uppercase">IQC System</span>
                    </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 py-6 px-4 overflow-y-auto space-y-6">
                <div>
                    <p className="px-2 mb-3 text-[11px] font-black text-black uppercase tracking-[0.2em]">Work</p>
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = view === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 border-[3px] border-black transition-all text-sm font-black uppercase tracking-wider group ${isActive
                                        ? 'bg-secondary shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1'
                                        : 'bg-white hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <p className="px-2 mb-3 text-[11px] font-black text-black uppercase tracking-[0.2em]">Control</p>
                    <nav className="space-y-2">
                        {controlItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = view === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 border-[3px] border-black transition-all text-sm font-black uppercase tracking-wider group ${isActive
                                        ? 'bg-secondary shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1'
                                        : 'bg-white hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t-[3px] border-black bg-f0f0f0">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 border-[3px] border-black bg-white hover:bg-accent hover:text-white transition-all text-sm font-black uppercase tracking-wider group hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    </>
);
