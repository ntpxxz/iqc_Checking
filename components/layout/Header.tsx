'use client';
import React from 'react';
import {
    Search, Bell, ChevronDown, Globe, Command,
    LayoutDashboard, ClipboardCheck, History, Settings
} from 'lucide-react';

interface HeaderProps {
    view: string;
    setView: (view: string) => void;
    filterText: string;
    setFilterText: (text: string) => void;
    notifications: any[];
    onNotificationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    view,
    setView,
    filterText,
    setFilterText,
    notifications,
    onNotificationClick
}) => {
    const navItems = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'INSPECT', label: 'Inspection', icon: ClipboardCheck },
        { id: 'HISTORY', label: 'History', icon: History },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
    ];

    return (
        <header className="h-16 bg-white border-b border-[#EDEBE9] flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#ffe500] rounded-xl flex items-center justify-center shadow-sm">
                        <Command className="w-5 h-5 text-[#323130]" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[#323130]">IQC<span className="text-[#605E5C] font-medium">PRO</span></span>
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                                        ? 'bg-[#F3F2F1] text-[#323130]'
                                        : 'text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#323130]'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#323130]' : 'text-[#605E5C]'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group w-64 hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#605E5C] group-focus-within:text-[#ffe500] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 bg-[#F3F2F1] border-transparent focus:bg-white focus:border-[#ffe500] focus:ring-4 focus:ring-[#ffe500]/10 rounded-xl pl-10 pr-4 text-sm transition-all outline-none"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>

                <div className="w-px h-6 bg-[#EDEBE9] mx-2" />

                <div className="flex items-center gap-2">
                    <button
                        onClick={onNotificationClick}
                        className="p-2.5 hover:bg-[#F3F2F1] rounded-xl text-[#605E5C] relative transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#A4262C] rounded-full border-2 border-white" />
                        )}
                    </button>

                    <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 hover:bg-[#F3F2F1] rounded-xl transition-all group border border-transparent hover:border-[#EDEBE9]">
                        <div className="w-8 h-8 bg-[#ffe500] rounded-full flex items-center justify-center text-[#323130] font-bold text-xs shadow-sm border-2 border-white">
                            JD
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-bold text-[#323130] leading-none">Jane Doe</p>
                            <p className="text-[10px] text-[#605E5C] mt-0.5">Inspector</p>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-[#605E5C] group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
};
