'use client';

import React from 'react';
import {
    AlertCircle, Eye, RefreshCw, Download, History, PackageCheck, Check, Save, Printer
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsViewProps {
    appSettings: any;
    updateSettings: (settings: any) => void;
    saveSettings: () => void;
    settingsSaved: boolean;
}

export function SettingsView({
    appSettings,
    updateSettings,
    saveSettings,
    settingsSaved,
}: SettingsViewProps) {
    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your application preferences and configurations</p>
                </div>
                <button onClick={saveSettings} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${settingsSaved ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-slate-900 hover:bg-yellow-500'}`}>
                    {settingsSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {settingsSaved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile & Preferences */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                JD
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">Jane Doe</h3>
                                <p className="text-sm text-slate-500">Quality Inspector</p>
                                <p className="text-xs text-slate-400 mt-1">jane.doe@company.com</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">247</p>
                                <p className="text-xs text-slate-500">Inspections</p>
                            </div>
                            <div className="text-center border-x border-slate-100">
                                <p className="text-2xl font-bold text-emerald-600">98.2%</p>
                                <p className="text-xs text-slate-500">Pass Rate</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-800">12m</p>
                                <p className="text-xs text-slate-500">Avg Time</p>
                            </div>
                        </div>
                    </div>

                    {/* Inspection Standards */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-yellow-50 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-slate-800">Inspection Standards</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Default AQL Level</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 focus:bg-white focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
                                    value={appSettings.defaultAql}
                                    onChange={(e) => updateSettings({ defaultAql: e.target.value })}
                                >
                                    <option value="0.65">0.65 (Strict)</option>
                                    <option value="1.0">1.0 (Normal)</option>
                                    <option value="2.5">2.5 (Loose)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sampling Standard</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 focus:bg-white focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
                                    value={appSettings.samplingStandard}
                                    onChange={(e) => updateSettings({ samplingStandard: e.target.value })}
                                >
                                    <option>ISO 2859-1</option>
                                    <option>ANSI/ASQ Z1.4</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-800">Notifications & Alerts</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                        <RefreshCw className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 text-sm">New Task Alerts</p>
                                        <p className="text-xs text-slate-500">Get notified when new tasks arrive</p>
                                    </div>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${appSettings.emailNotifications ? 'bg-yellow-400' : 'bg-slate-200'}`} onClick={() => updateSettings({ emailNotifications: !appSettings.emailNotifications })}>
                                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${appSettings.emailNotifications ? 'left-5' : 'left-0.5'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                        <Download className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 text-sm">Email Summaries</p>
                                        <p className="text-xs text-slate-500">Receive daily inspection reports</p>
                                    </div>
                                </div>
                                <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                        <Printer className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 text-sm">Auto Print Labels</p>
                                        <p className="text-xs text-slate-500">Automatically print after inspection</p>
                                    </div>
                                </div>
                                <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                                    <RefreshCw className="w-4 h-4 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm">Sync Data</p>
                                    <p className="text-xs text-slate-500">Refresh from warehouse</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Download className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm">Export Report</p>
                                    <p className="text-xs text-slate-500">Download as Excel</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                    <History className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm">View Logs</p>
                                    <p className="text-xs text-slate-500">Activity history</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                        <h3 className="font-bold mb-4">System Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Version</span>
                                <span className="font-mono">v2.1.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Database</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Connected
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Last Sync</span>
                                <span className="font-mono text-xs">Just now</span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-yellow-100 rounded-xl">
                                <PackageCheck className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-slate-800">Need Help?</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">Contact support for assistance with the IQC system.</p>
                        <button className="w-full py-2.5 bg-yellow-400 text-slate-900 rounded-xl font-semibold text-sm hover:bg-yellow-500 transition-colors">
                            Get Support
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
