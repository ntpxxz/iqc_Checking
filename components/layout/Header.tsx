'use client';
import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Task } from '@/types';

interface HeaderProps {
    setIsSidebarOpen: (isOpen: boolean) => void;
    filterText: string;
    setFilterText: (text: string) => void;
    notifications?: Task[];
    onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    setIsSidebarOpen,
    filterText,
    setFilterText,
    notifications = [],
    onNotificationClick
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationCount = notifications.length;

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search Bar */}
                <div className="relative flex-1 md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search parts, lots, or GRN..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white outline-none text-sm font-medium border border-slate-100 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 rounded-xl transition-all text-slate-700 placeholder:text-slate-400"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) {
                                // We don't call onNotificationClick here anymore to avoid clearing immediately
                                // Or we can call it to mark as read but keep the items
                            }
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all relative"
                    >
                        <Bell className="w-5 h-5" />
                        {notificationCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-slate-900 text-[11px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white z-10"
                            >
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </motion.span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                            >
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                    {notificationCount > 0 && (
                                        <button
                                            onClick={() => {
                                                onNotificationClick?.();
                                                setShowNotifications(false);
                                            }}
                                            className="text-[10px] font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-wider"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notificationCount === 0 ? (
                                        <div className="py-8 text-center">
                                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-sm text-slate-400">No new notifications</p>
                                        </div>
                                    ) : (
                                        <div className="p-2 space-y-1">
                                            {notifications.map((task, idx) => (
                                                <div key={task.id + idx} className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700 leading-tight">{task.part}</p>
                                                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{task.vendor}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                {task.warehouse} • Just now
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-8 bg-slate-200"></div>

                {/* User Avatar */}
                <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                        JD
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-slate-700">Jane Doe</p>
                        <p className="text-xs text-slate-400">Inspector</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                </button>
            </div>
        </header>
    );
};
