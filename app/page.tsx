'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Clock, CheckCircle2, AlertCircle, History, PackageCheck,
  CalendarRange, RefreshCw, Printer, Eye, Download, Save, Check,
  Box, Truck, MapPin, User, ShieldCheck, Ban, XCircle, LayoutGrid, Loader2, Warehouse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Components
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { TaskTable } from '@/components/tables/TaskTable';
import { HistoryTable } from '@/components/tables/HistoryTable';
import { JudgmentTable } from '@/components/tables/JudgmentTable';
import { ToastContainer } from '@/components/ui/Toast';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { PaginationFooter } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { RejectModal } from '@/components/modals/RejectModal';
import { PrintModal } from '@/components/modals/PrintModal';
import { DetailModal } from '@/components/modals/DetailModal';

// Hooks
import { useTasks } from '@/hooks/useTasks';
import { useHistory } from '@/hooks/useHistory';
import { useJudgment } from '@/hooks/useJudgment';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/useToast';

// Types
import { Task, HistoryItem } from '@/types';

export default function IQCDashboard() {
  // --- CORE STATE ---
  const [view, setView] = useState('DASHBOARD');
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);



  // Inspection State
  const [activeJob, setActiveJob] = useState<Task | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [manualVerdict, setManualVerdict] = useState<string | null>(null);

  // Selection State
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Modals State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<HistoryItem | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Pagination State
  const [queuePage, setQueuePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [judgmentPage, setJudgmentPage] = useState(1);
  const itemsPerPage = 5;

  // UI State
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showJudgmentDateMenu, setShowJudgmentDateMenu] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Hooks - Toast hook first so we can use addToast in useTasks callback
  const { toasts, addToast } = useToast();

  // New task notification callback
  const handleNewTasks = useCallback((count: number, newTasks: Task[]) => {
    // Play notification sound
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => { });
    } catch (e) {
      // Fallback: Use browser notification API if available
    }

    // Show toast notification
    if (count === 1) {
      const task = newTasks[0];
      addToast(`📦 New task: ${task.part} from ${task.vendor}`, 'warning');
    } else {
      addToast(`📦 ${count} new tasks incoming!`, 'warning');
    }

    // Update notification count
    setNotificationCount(prev => prev + count);
  }, [addToast]);

  const { tasks: processedTasks, filterText, setFilterText, dateRange, setDateRange, requestSort, removeTask, warehouseFilter, setWarehouseFilter, warehouses } = useTasks({ onNewTasks: handleNewTasks });
  const { history: recentHistory, addHistoryItem } = useHistory();
  const { results: processedJudgmentResults, filterText: judgmentFilterText, setFilterText: setJudgmentFilterText, dateRange: judgmentDateRange, setDateRange: setJudgmentDateRange, requestSort: requestJudgmentSort, addResult } = useJudgment();
  const { settings: appSettings, updateSettings } = useSettings();

  // Column Visibility
  const columnLabels: Record<string, string> = {
    urgent: 'Urgent', id: 'No', receivedAt: 'Received Date', warehouse: 'Warehouse', inspectionType: 'Insp. Type',
    invoice: 'Invoice', lotNo: 'Lot IQC', model: 'Model', partName: 'Part Type',
    part: 'Part No', rev: 'Rev.', vendor: 'Vendor', qty: 'Qty',
    samplingType: 'Sampling', totalSampling: 'Total Sample', aql: 'AQL',
    receiver: 'Receiver', issue: 'Issue', timestamp: 'Timestamp', iqcStatus: 'Status', action: 'Action'
  };

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.keys(columnLabels).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  // --- EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => setDataLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { setQueuePage(1); }, [filterText, dateRange]);
  useEffect(() => { setJudgmentPage(1); }, [judgmentFilterText, judgmentDateRange]);

  // --- ACTIONS ---
  const toggleColumn = (colKey: string) => {
    setVisibleColumns(prev => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  const resetDateRange = () => {
    setDateRange({ start: '', end: '' });
    setShowDateMenu(false);
  };

  const resetJudgmentDateRange = () => {
    setJudgmentDateRange({ start: '', end: '' });
    setShowJudgmentDateMenu(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(processedTasks.map(t => t.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handlePrintLabels = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setShowPrintModal(false);
      addToast(`${selectedItems.length} Labels sent to printer`, 'success');
      setSelectedItems([]);
    }, 2000);
  };

  const handleStartInspection = (task: Task) => {
    setLoading(true);
    setTimeout(() => {
      const appliedAql = task.aql || appSettings.defaultAql;
      let sampleSize = 200;
      if (task.qty <= 3200) sampleSize = 125;
      if (task.qty <= 1200) sampleSize = 80;
      if (task.qty <= 500) sampleSize = 50;

      const reqs = {
        sampleSize: sampleSize,
        majorLimit: appliedAql === '0.65' ? 2 : 5,
        minorLimit: appliedAql === '0.65' ? 3 : 7,
        code: 'K'
      };

      setActiveJob({ ...task, requirements: reqs });
      setManualVerdict(null);
      setLoading(false);
      setView('INSPECT');
    }, 800);
  };

  const handleRejectClick = () => {
    setManualVerdict('FAIL');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    submitInspection('FAIL');
    setShowRejectModal(false);
  };

  const submitInspection = (finalVerdictOverride: string | null = null) => {
    const finalV = finalVerdictOverride || manualVerdict;
    if (!finalV || !activeJob) return;

    setVerdict(finalV);
    setView('RESULT');

    const newRecord: HistoryItem = {
      id: activeJob.id,
      lotNo: activeJob.lotNo,
      part: activeJob.part,
      partName: activeJob.partName,
      vendor: activeJob.vendor,
      qty: activeJob.qty,
      status: finalV === 'PASS' ? 'RELEASED' : 'QUARANTINE',
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      inspector: 'Jane Doe'
    };
    addHistoryItem(newRecord);

    const newJudgment = {
      date: new Date().toLocaleDateString('en-GB'),
      lotIqc: activeJob.lotNo,
      partNo: activeJob.part,
      supplier: activeJob.vendor,
      shipLot: '-',
      invoiceNo: activeJob.invoice,
      rev: activeJob.rev,
      country: '-',
      judgment: finalV,
      actionLot: finalV === 'PASS' ? 'Release to WH' : 'Hold',
      remark: '-'
    };
    addResult(newJudgment);

    removeTask(activeJob.id);
    addToast(finalV === 'PASS' ? 'Inspection Passed' : 'Lot Rejected & Quarantined', finalV === 'PASS' ? 'success' : 'error');
  };

  const returnToDashboard = () => {
    setFilterText('');
    setActiveJob(null);
    setVerdict(null);
    setManualVerdict(null);
    setView('DASHBOARD');
  };

  const saveSettings = () => {
    setSettingsSaved(true);
    addToast('Settings saved successfully', 'success');
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Pagination Logic
  const paginatedQueue = useMemo(() => {
    const start = (queuePage - 1) * itemsPerPage;
    return processedTasks.slice(start, start + itemsPerPage);
  }, [processedTasks, queuePage]);

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * itemsPerPage;
    return recentHistory.slice(start, start + itemsPerPage);
  }, [recentHistory, historyPage]);

  const paginatedJudgment = useMemo(() => {
    const start = (judgmentPage - 1) * itemsPerPage;
    return processedJudgmentResults.slice(start, start + itemsPerPage);
  }, [processedJudgmentResults, judgmentPage]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 md:pl-64 transition-colors duration-300 relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-yellow-50/50 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50/40 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-slate-100/50 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} view={view} setView={setView} />
        <ToastContainer toasts={toasts} />

        <RejectModal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} onConfirm={confirmReject} />
        <PrintModal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} onPrint={handlePrintLabels} isPrinting={isPrinting} itemCount={selectedItems.length} />
        <DetailModal item={showDetailModal} onClose={() => setShowDetailModal(null)} />

        <Header
          setIsSidebarOpen={setIsSidebarOpen}
          filterText={filterText}
          setFilterText={setFilterText}
          notificationCount={notificationCount}
          onNotificationClick={() => setNotificationCount(0)}
        />

        <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            {view === 'DASHBOARD' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                  <StatCard label="Pending Tasks" value={processedTasks.length} icon={Clock} colorClass="bg-blue-50 text-blue-600" />
                  <StatCard label="Inspected Today" value={recentHistory.filter(h => h.date === '15/01/2026').length} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" trend="12%" />
                  <StatCard label="Urgent Items" value={processedTasks.filter(t => t.urgent).length} icon={AlertCircle} colorClass="bg-rose-50 text-rose-600" />
                  <StatCard label="Avg Time/Lot" value="12m" icon={History} colorClass="bg-amber-50 text-amber-600" />
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-2 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex gap-8 overflow-x-auto w-full md:w-auto no-scrollbar">
                      <button onClick={() => setActiveTab('queue')} className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap relative ${activeTab === 'queue' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                        Inspection Queue
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] transition-colors ${activeTab === 'queue' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                          {processedTasks.length}
                        </span>
                      </button>
                      <button onClick={() => setActiveTab('history')} className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'history' ? 'border-yellow-400 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                        Recent History
                      </button>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto items-center">
                      {activeTab === 'queue' && (
                        <>
                          {selectedItems.length > 0 && (
                            <div className="flex items-center gap-2 mr-2 animate-in slide-in-from-right fade-in">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{selectedItems.length} selected</span>
                              <button onClick={() => setShowPrintModal(true)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-100 transition-all" title="Print Labels"><Printer className="w-4 h-4" /></button>
                            </div>
                          )}
                          <div className="relative">
                            <button onClick={() => setShowColumnMenu(!showColumnMenu)} className={`p-2 border rounded-xl transition-all ${showColumnMenu ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500'}`}><Eye className="w-4 h-4" /></button>
                            {showColumnMenu && (
                              <div className="absolute right-0 top-12 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Toggle Columns</h4>
                                <div className="max-h-64 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                                  {Object.keys(visibleColumns).map(key => (
                                    <label key={key} className="flex items-center gap-3 text-xs font-medium cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                                      <input type="checkbox" checked={visibleColumns[key]} onChange={() => toggleColumn(key)} className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-400 w-4 h-4" />
                                      <span className="text-slate-600">{columnLabels[key] || key}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <button onClick={() => setShowDateMenu(!showDateMenu)} className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${dateRange.start || dateRange.end ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500'}`}><CalendarRange className="w-4 h-4" /> <span className="hidden md:inline">Date Range</span></button>
                            {showDateMenu && (
                              <div className="absolute right-0 top-12 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in zoom-in-95">
                                <div className="space-y-4">
                                  <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Start Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /></div>
                                  <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">End Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                                  <div className="pt-3 border-t border-slate-50 flex justify-end">
                                    <button onClick={resetDateRange} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reset Filters</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Warehouse Filter */}
                          <div className="relative">
                            <Warehouse className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                              value={warehouseFilter}
                              onChange={(e) => setWarehouseFilter(e.target.value)}
                              className={`pl-9 pr-4 py-2.5 border rounded-xl outline-none text-xs font-bold transition-all appearance-none cursor-pointer ${warehouseFilter !== 'all' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500'}`}
                            >
                              <option value="all">All Warehouses</option>
                              {warehouses.map((wh) => (
                                <option key={wh} value={wh}>{wh}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {activeTab === 'queue' && (
                    <div className="overflow-x-auto">
                      {dataLoading ? <TableSkeleton cols={10} rows={5} /> : (
                        <TaskTable
                          tasks={paginatedQueue}
                          selectedItems={selectedItems}
                          visibleColumns={visibleColumns}
                          onSelectAll={handleSelectAll}
                          onSelectItem={handleSelectItem}
                          onSort={requestSort}
                          onInspect={handleStartInspection}
                        />
                      )}
                      <PaginationFooter currentPage={queuePage} totalItems={processedTasks.length} itemsPerPage={itemsPerPage} onPageChange={setQueuePage} />
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="flex flex-col">
                      <div className="overflow-x-auto">
                        {dataLoading ? <TableSkeleton cols={7} rows={5} /> : (
                          <HistoryTable history={paginatedHistory} onItemClick={setShowDetailModal} />
                        )}
                      </div>
                      <PaginationFooter currentPage={historyPage} totalItems={recentHistory.length} itemsPerPage={itemsPerPage} onPageChange={setHistoryPage} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'INSPECT' && activeJob && (
              <motion.div key="inspect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Info Panel */}
                <div className="lg:col-span-5 space-y-6">
                  <motion.button whileHover={{ x: -4 }} onClick={returnToDashboard} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group">
                    <Box className="w-4 h-4 group-hover:scale-110 transition-transform" /> Back to Dashboard
                  </motion.button>

                  <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-3">{activeJob.inspectionType}</span>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{activeJob.part}</h3>
                          <p className="text-lg text-slate-500 font-medium">{activeJob.partName}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200"><Box className="w-8 h-8 text-white" /></div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mb-10">
                        <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Lot IQC</label><p className="font-mono text-base font-bold text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl inline-block border border-indigo-100/50">{activeJob.lotNo}</p></div>
                        <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Quantity</label><p className="text-xl font-black text-slate-900">{activeJob.qty.toLocaleString()}</p></div>
                        <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Vendor</label><p className="text-base font-bold text-slate-700 flex items-center gap-2"><Truck className="w-4 h-4 text-slate-300" />{activeJob.vendor}</p></div>
                        <div className="space-y-1"><label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Revision</label><p className="text-base font-bold text-slate-700">{activeJob.rev}</p></div>
                      </div>

                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CalendarRange className="w-3 h-3" /> Receiving Logistics</h4>
                        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                          <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Invoice</span><span className="font-bold text-slate-700 text-sm">{activeJob.invoice}</span></div>
                          <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Mfg Date</span><span className="font-bold text-slate-700 text-sm">{activeJob.mfgDate}</span></div>
                          <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Location</span><span className="font-bold text-slate-700 text-sm flex items-center gap-1.5"><MapPin className="w-3 h-3 text-indigo-400" />{activeJob.location}</span></div>
                          <div className="flex flex-col gap-0.5"><span className="text-slate-400 text-[10px] font-bold uppercase">Receiver</span><span className="font-bold text-slate-700 text-sm flex items-center gap-1.5"><User className="w-3 h-3 text-indigo-400" />{activeJob.receiver}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[2rem] shadow-xl shadow-indigo-200 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Sampling Protocol</h3>
                      <div className="flex items-baseline gap-2 mb-2"><span className="text-5xl font-black">{activeJob.requirements?.sampleSize}</span><span className="text-xl font-medium text-indigo-200">units</span></div>
                      <p className="text-sm text-indigo-100/80 font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> ISO 2859-1 (Level II, Code {activeJob.requirements?.code})</p>
                    </div>
                    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></motion.div>
                  </motion.div>
                </div>

                {/* Right Column: Decision Panel */}
                <div className="lg:col-span-7">
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white h-full flex flex-col p-10 md:p-16 relative overflow-hidden">
                    <div className="text-center relative z-10 mb-12">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Final Inspection Decision</h2>
                      <p className="text-slate-500 max-w-md mx-auto">Please evaluate the lot based on the sampling results and select the appropriate action.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                      <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setManualVerdict('PASS')} className={`relative group flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 transition-all duration-500 ${manualVerdict === 'PASS' ? 'bg-emerald-50 border-emerald-500 shadow-[0_20px_40px_rgba(16,185,129,0.15)]' : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'}`}>
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${manualVerdict === 'PASS' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}><ShieldCheck className="w-10 h-10" /></div>
                        <span className={`text-lg font-black tracking-tight transition-colors duration-500 ${manualVerdict === 'PASS' ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'}`}>ACCEPT LOT</span>
                        {manualVerdict === 'PASS' && <motion.div layoutId="active-indicator" className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg"><Check className="w-5 h-5" /></motion.div>}
                      </motion.button>

                      <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRejectClick} className={`relative group flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 transition-all duration-500 ${manualVerdict === 'FAIL' ? 'bg-rose-50 border-rose-500 shadow-[0_20px_40px_rgba(244,63,94,0.15)]' : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/30'}`}>
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${manualVerdict === 'FAIL' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 text-slate-300 group-hover:bg-rose-100 group-hover:text-rose-500'}`}><Ban className="w-10 h-10" /></div>
                        <span className={`text-lg font-black tracking-tight transition-colors duration-500 ${manualVerdict === 'FAIL' ? 'text-rose-700' : 'text-slate-400 group-hover:text-rose-600'}`}>REJECT LOT</span>
                        {manualVerdict === 'FAIL' && <motion.div layoutId="active-indicator" className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg"><XCircle className="w-5 h-5" /></motion.div>}
                      </motion.button>
                    </div>

                    <div className="mt-auto relative z-10">
                      <motion.button whileHover={manualVerdict === 'PASS' ? { scale: 1.02, y: -2 } : {}} whileTap={manualVerdict === 'PASS' ? { scale: 0.98 } : {}} onClick={() => submitInspection(null)} disabled={!manualVerdict || manualVerdict === 'FAIL'} className={`w-full py-6 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 ${manualVerdict === 'PASS' ? 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                        {manualVerdict === 'PASS' ? <><CheckCircle2 className="w-6 h-6" /> Confirm Release</> : 'Select a Decision'}
                      </motion.button>
                      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Action will be logged for inspector: <span className="text-slate-600">Jane Doe</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'RESULT' && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 20, stiffness: 100 }} className="flex flex-col items-center justify-center py-12 md:py-24 max-w-2xl mx-auto">
                <div className="relative mb-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", damping: 12 }} className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 ${verdict === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-rose-500 text-white shadow-rose-200'}`}>
                    {verdict === 'PASS' ? <CheckCircle2 className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
                  </motion.div>
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className={`absolute inset-0 -m-4 rounded-[3rem] border-2 ${verdict === 'PASS' ? 'border-emerald-200' : 'border-rose-200'}`}></motion.div>
                </div>

                <div className="text-center space-y-4 mb-12">
                  <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-black text-slate-900 tracking-tight">Inspection Complete</motion.h1>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-slate-500 font-medium">The lot has been successfully processed and marked as <br /><span className={`font-black uppercase tracking-wider ${verdict === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>{verdict === 'PASS' ? 'RELEASED TO WAREHOUSE' : 'QUARANTINED'}</span></motion.p>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm w-full mb-12 grid grid-cols-2 gap-8">
                  <div className="space-y-1"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Lot Number</span><span className="font-mono font-bold text-slate-700">{activeJob?.lotNo}</span></div>
                  <div className="space-y-1 text-right"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Timestamp</span><span className="font-bold text-slate-700">{new Date().toLocaleTimeString()}</span></div>
                  <div className="space-y-1"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Part Number</span><span className="font-bold text-slate-700">{activeJob?.part}</span></div>
                  <div className="space-y-1 text-right"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Inspector</span><span className="font-bold text-slate-700">Jane Doe</span></div>
                </motion.div>

                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={returnToDashboard} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5" /> Return to Dashboard
                </motion.button>
              </motion.div>
            )}

            {view === 'JUDGMENT' && (
              <motion.div key="judgment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Judgment Results</h2>
                    <p className="text-sm text-slate-500 mt-1">View and export historical inspection judgments</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Eye className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter results..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all"
                        value={judgmentFilterText}
                        onChange={(e) => setJudgmentFilterText(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <button onClick={() => setShowJudgmentDateMenu(!showJudgmentDateMenu)} className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${judgmentDateRange.start || judgmentDateRange.end ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'}`}><CalendarRange className="w-4 h-4" /> <span className="hidden md:inline">Date Range</span></button>
                      {showJudgmentDateMenu && (
                        <div className="absolute right-0 top-12 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in zoom-in-95">
                          <div className="space-y-4">
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Start Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={judgmentDateRange.start} onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, start: e.target.value })} /></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">End Date</label><input type="date" className="w-full border border-slate-100 bg-slate-50 rounded-xl p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-yellow-100 focus:border-yellow-300 outline-none transition-all" value={judgmentDateRange.end} onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, end: e.target.value })} /></div>
                            <div className="pt-3 border-t border-slate-50 flex justify-end">
                              <button onClick={resetJudgmentDateRange} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Reset Filters</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowExportModal(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"><Download className="w-4 h-4" /> Export</button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <JudgmentTable results={paginatedJudgment} onSort={requestJudgmentSort} />
                  </div>
                  <PaginationFooter currentPage={judgmentPage} totalItems={processedJudgmentResults.length} itemsPerPage={itemsPerPage} onPageChange={setJudgmentPage} />
                </div>
              </motion.div>
            )}

            {view === 'SETTINGS' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-5xl mx-auto space-y-6">
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
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}