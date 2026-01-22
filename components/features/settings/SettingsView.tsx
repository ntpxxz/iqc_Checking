'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { AppSettings } from '@/types';

interface SettingsViewProps {
    settings: AppSettings;
    setSettings: (settings: AppSettings) => void;
}

export function SettingsView({
    settings,
    setSettings,
}: SettingsViewProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#323130]">Settings</h2>
                    <p className="text-sm text-[#605E5C]">Manage your account preferences and profile</p>
                </div>
                <button className="ms-button ms-button-primary h-10 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98]">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="space-y-6">
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
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#605E5C] uppercase tracking-wider">User Role</label>
                            <select className="ms-input w-full">
                                <option value="admin">Administrator</option>
                                <option value="user">Standard User</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
