'use client';

import React from 'react';
import {
    User, Shield, Bell, Globe, Save, RefreshCw, ChevronRight, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppSettings } from '@/types';

interface SettingsViewProps {
    settings: AppSettings;
    setSettings: (settings: AppSettings) => void;
}

export function SettingsView({
    settings,
    setSettings,
}: SettingsViewProps) {
    const sections = [
        { id: 'profile', label: 'User Profile', icon: User },
        { id: 'inspection', label: 'Inspection Standards', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'regional', label: 'Regional Settings', icon: Globe },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#323130]">Settings</h2>
                    <p className="text-sm text-[#605E5C]">Manage your account preferences and system standards</p>
                </div>
                <button className="ms-button ms-button-primary h-10 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98]">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${section.id === 'profile' ? 'bg-[#ffe500] text-[#323130] shadow-sm' : 'text-[#605E5C] hover:bg-[#F3F2F1] hover:text-[#323130]'}`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-[#EDEBE9]">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#A4262C] hover:bg-[#FDE7E9] transition-all">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <div className="ms-card p-6">
                        <h3 className="text-lg font-bold text-[#323130] mb-6">User Profile</h3>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-[#ffe500] rounded-2xl flex items-center justify-center text-[#323130] text-2xl font-bold shadow-sm">
                                JD
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[#323130]">Jane Doe</h4>
                                <p className="text-sm text-[#605E5C]">Senior Quality Inspector • ID: 8829</p>
                                <button className="mt-2 text-xs font-bold text-[#0078D4] hover:underline">Change Avatar</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Full Name</label>
                                <input type="text" className="ms-input w-full" defaultValue="Jane Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">Email Address</label>
                                <input type="email" className="ms-input w-full" defaultValue="jane.doe@example.com" />
                            </div>
                        </div>
                    </div>

                    {/* Inspection Standards */}
                    <div className="ms-card p-6">
                        <h3 className="text-lg font-bold text-[#323130] mb-6">Inspection Standards</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#FAF9F8] rounded-xl border border-[#EDEBE9]">
                                <div>
                                    <p className="text-sm font-bold text-[#323130]">Default AQL Standard</p>
                                    <p className="text-xs text-[#605E5C]">ISO 2859-1 (MIL-STD-105E)</p>
                                </div>
                                <select className="ms-input min-w-[120px]">
                                    <option>Standard 1.0</option>
                                    <option>Standard 0.65</option>
                                    <option>Standard 0.40</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#FAF9F8] rounded-xl border border-[#EDEBE9]">
                                <div>
                                    <p className="text-sm font-bold text-[#323130]">Auto-print Labels</p>
                                    <p className="text-xs text-[#605E5C]">Generate QR codes immediately after inspection</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, autoPrintLabel: !settings.autoPrintLabel })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${settings.autoPrintLabel ? 'bg-[#ffe500]' : 'bg-[#C8C6C4]'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoPrintLabel ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
