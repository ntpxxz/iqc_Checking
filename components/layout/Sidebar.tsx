'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, X, LayoutGrid, Gavel, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    view: string;
    setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, view, setView }) => (
    <>
        <AnimatePresence>
            {isSidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}
        </AnimatePresence>
        <div className={`fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 flex flex-col z-50 transition-transform duration-300 w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 rounded-lg"><ClipboardList className="w-6 h-6 text-slate-900" /></div>
                    <span className="font-bold text-xl text-white tracking-tight">QualiTrack</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                <button onClick={() => { setView('DASHBOARD'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'DASHBOARD' ? 'bg-yellow-400/10 text-yellow-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><LayoutGrid className="w-5 h-5" /> Dashboard</button>
                <button onClick={() => { setView('JUDGMENT'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'JUDGMENT' ? 'bg-yellow-400/10 text-yellow-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><Gavel className="w-5 h-5" /> Judgment Result</button>
                <button onClick={() => { setView('SETTINGS'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'SETTINGS' ? 'bg-yellow-400/10 text-yellow-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><Settings className="w-5 h-5" /> Settings</button>
            </div>
            <div className="p-4 border-t border-slate-800">
                <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-all">
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>
        </div>
    </>
);
