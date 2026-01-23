'use client';

import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any[];
    selectedIds?: string[];
}

export function ExportModal({ isOpen, onClose, data, selectedIds = [] }: ExportModalProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([
        'date', 'lotIqc', 'partNo', 'partName', 'supplier', 'qty', 'judgment', 'inspector'
    ]);

    const exportData = selectedIds.length > 0
        ? data.filter(item => selectedIds.includes(item.id))
        : data;

    const columns = [
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'lotIqc', label: 'Lot IQC' },
        { key: 'partNo', label: 'Part No' },
        { key: 'partName', label: 'Part Name' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'invoiceNo', label: 'Invoice No' },
        { key: 'qty', label: 'Quantity' },
        { key: 'judgment', label: 'Judgment' },
        { key: 'actionLot', label: 'Action' },
        { key: 'inspector', label: 'Inspector' },
        { key: 'remark', label: 'Remark' },
    ];

    const toggleColumn = (key: string) => {
        if (selectedColumns.includes(key)) {
            setSelectedColumns(selectedColumns.filter(c => c !== key));
        } else {
            setSelectedColumns([...selectedColumns, key]);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const exportCols = columns.filter(c => selectedColumns.includes(c.key));
            const res = await fetch('/api/inspections/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    columns: exportCols,
                    data: exportData
                }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `IQC_Export_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                onClose();
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-[#EDEBE9] flex items-center justify-between bg-[#FAF9F8]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ffe500] rounded-xl flex items-center justify-center shadow-sm">
                                    <FileText className="w-5 h-5 text-[#323130]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#323130]">Export Data</h3>
                                    <p className="text-xs text-[#605E5C]">
                                        {selectedIds.length > 0
                                            ? `Exporting ${selectedIds.length} selected records`
                                            : `Exporting all ${data.length} records`}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[#EDEBE9] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#605E5C]" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {columns.map(col => (
                                    <label
                                        key={col.key}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedColumns.includes(col.key)
                                            ? 'border-[#ffe500] bg-[#FFFDE7]'
                                            : 'border-[#EDEBE9] hover:border-[#ffe500]/50'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedColumns.includes(col.key) ? 'bg-[#ffe500] border-[#ffe500]' : 'bg-white border-[#8A8886]'
                                            }`}>
                                            {selectedColumns.includes(col.key) && <CheckCircle2 className="w-3.5 h-3.5 text-[#323130]" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedColumns.includes(col.key)}
                                            onChange={() => toggleColumn(col.key)}
                                        />
                                        <span className="text-sm font-medium text-[#323130]">{col.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-xl border-2 border-[#EDEBE9] text-[#323130] font-bold hover:bg-[#FAF9F8] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={selectedColumns.length === 0 || isExporting}
                                    className="flex-[2] h-12 rounded-xl bg-[#ffe500] text-[#323130] font-bold shadow-lg shadow-[#ffe500]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isExporting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                    {isExporting ? 'Exporting...' : `Export ${exportData.length} Records`}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
