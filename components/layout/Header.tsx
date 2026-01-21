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
        <header className="h-20 bg-white border-b-[3px] border-black sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 border-2 border-black bg-primary hover:bg-black hover:text-white transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Search Bar */}
                <div className="relative flex-1 md:w-96">
                    <Search className="w-5 h-5 text-black absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                    <input
                        type="text"
                        placeholder="SEARCH PARTS, LOTS..."
                        className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-black focus:bg-primary focus:shadow-[4px_4px_0px_black] focus:-translate-x-1 focus:-translate-y-1 outline-none text-sm font-black uppercase tracking-wider transition-all placeholder:text-black/40"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-3 border-[3px] border-black transition-all relative ${showNotifications ? 'bg-black text-white' : 'bg-white hover:bg-primary hover:shadow-[4px_4px_0px_black] hover:-translate-x-1 hover:-translate-y-1'}`}
                    >
                        <Bell className="w-6 h-6" />
                        {notificationCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-[12px] font-black border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_black]"
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
                                className="absolute right-0 top-16 w-80 bg-white border-[3px] border-black shadow-[8px_8px_0px_black] overflow-hidden z-50"
                            >
                                <div className="px-4 py-4 border-b-[3px] border-black bg-secondary flex items-center justify-between">
                                    <h3 className="font-black text-black text-sm uppercase tracking-widest">Notifications</h3>
                                    {notificationCount > 0 && (
                                        <button
                                            onClick={() => {
                                                onNotificationClick?.();
                                                setShowNotifications(false);
                                            }}
                                            className="text-[10px] font-black text-black bg-white px-2 py-1 border-2 border-black hover:bg-accent hover:text-white uppercase tracking-wider"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notificationCount === 0 ? (
                                        <div className="py-10 text-center bg-f0f0f0">
                                            <Bell className="w-10 h-10 text-black/20 mx-auto mb-3" />
                                            <p className="text-sm font-black text-black/40 uppercase">No new alerts</p>
                                        </div>
                                    ) : (
                                        <div className="p-2 space-y-2 bg-f0f0f0">
                                            {notifications.map((task, idx) => (
                                                <div key={task.id + idx} className="p-4 bg-white border-[3px] border-black hover:bg-primary transition-colors cursor-pointer">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 border-2 border-black bg-secondary flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_black]">
                                                            <div className="w-3 h-3 bg-black animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-black leading-tight uppercase">{task.part}</p>
                                                            <p className="text-[11px] font-bold text-black/60 mt-1 uppercase">{task.vendor}</p>
                                                            <p className="text-[10px] font-black text-black/40 mt-2 flex items-center gap-2">
                                                                <span className="w-2 h-2 bg-accent" />
                                                                {task.warehouse} • NOW
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
                <div className="hidden md:block w-[3px] h-10 bg-black"></div>

                {/* User Avatar */}
                <button className="flex items-center gap-3 p-1 border-[3px] border-transparent hover:border-black hover:bg-primary transition-all group">
                    <div className="w-10 h-10 bg-accent border-[3px] border-black text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_black] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                        JD
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-black text-black uppercase tracking-tighter">Jane Doe</p>
                        <p className="text-[10px] font-bold text-black/60 uppercase">Inspector</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-black hidden md:block" />
                </button>
            </div>
        </header>
    );
};
