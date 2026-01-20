'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, CheckCircle2, AlertCircle, History, PackageCheck,
  CalendarRange, RefreshCw, Printer, Eye, Download, Save, Check,
  Box, Truck, MapPin, User, ShieldCheck, Ban, XCircle, LayoutGrid, Loader2
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

  // Hooks
  const { tasks: processedTasks, filterText, setFilterText, dateRange, setDateRange, requestSort, removeTask } = useTasks();
  const { history: recentHistory, addHistoryItem } = useHistory();
  const { results: processedJudgmentResults, filterText: judgmentFilterText, setFilterText: setJudgmentFilterText, dateRange: judgmentDateRange, setDateRange: setJudgmentDateRange, requestSort: requestJudgmentSort, addResult } = useJudgment();
  const { settings: appSettings, updateSettings } = useSettings();
  const { toasts, addToast } = useToast();

  // Column Visibility
  const columnLabels: Record<string, string> = {
    urgent: 'Urgent', id: 'No', receivedAt: 'Received Date', inspectionType: 'Insp. Type',
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

        <Header setIsSidebarOpen={setIsSidebarOpen} filterText={filterText} setFilterText={setFilterText} />

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

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex gap-6 overflow-x-auto w-full md:w-auto no-scrollbar">
                      <button onClick={() => setActiveTab('queue')} className={`pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'queue' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-slate-500'}`}>Inspection Queue <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{processedTasks.length}</span></button>
                      <button onClick={() => setActiveTab('history')} className={`pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'history' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-slate-500'}`}>Recent History</button>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto items-center relative">
                      {activeTab === 'queue' && (
                        <>
                          {selectedItems.length > 0 && (
                            <div className="flex items-center gap-2 mr-2 animate-in slide-in-from-right fade-in">
                              <span className="text-xs font-bold text-slate-500">{selectedItems.length} selected</span>
                              <button onClick={() => setShowPrintModal(true)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Print Labels"><Printer className="w-4 h-4" /></button>
                            </div>
                          )}
                          <div className="relative">
                            <button onClick={() => setShowColumnMenu(!showColumnMenu)} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Eye className="w-4 h-4" /></button>
                            {showColumnMenu && (
                              <div className="absolute right-0 top-10 w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Toggle Columns</h4>
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                  {Object.keys(visibleColumns).map(key => (
                                    <label key={key} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                                      <input type="checkbox" checked={visibleColumns[key]} onChange={() => toggleColumn(key)} className="rounded text-yellow-600 focus:ring-yellow-400" />
                                      <span className="truncate">{columnLabels[key] || key}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <button onClick={() => setShowDateMenu(!showDateMenu)} className={`p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-2 ${dateRange.start || dateRange.end ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}`}><CalendarRange className="w-4 h-4" /> <span className="text-xs hidden md:inline">Date Range</span></button>
                            {showDateMenu && (
                              <div className="absolute right-0 top-10 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50">
                                <div className="space-y-3">
                                  <div><label className="text-xs font-bold text-slate-500 block mb-1">Start Date</label><input type="date" className="w-full border border-slate-200 rounded p-1.5 text-sm" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /></div>
                                  <div><label className="text-xs font-bold text-slate-500 block mb-1">End Date</label><input type="date" className="w-full border border-slate-200 rounded p-1.5 text-sm" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                                    <button onClick={resetDateRange} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Reset</button>
                                  </div>
                                </div>
                              </div>
                            )}
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
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <h2 className="text-2xl font-bold text-slate-800">Judgment Result Sampling</h2>
                    <div className="flex gap-2">
                      <div className="relative flex-1 md:flex-none">
                        <Eye className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input type="text" placeholder="Search results..." className="w-full md:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={judgmentFilterText} onChange={(e) => setJudgmentFilterText(e.target.value)} />
                      </div>
                      <div className="relative">
                        <button onClick={() => setShowJudgmentDateMenu(!showJudgmentDateMenu)} className={`p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-2 ${judgmentDateRange.start || judgmentDateRange.end ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : ''}`}><CalendarRange className="w-4 h-4" /> <span className="text-xs hidden md:inline">Date Range</span></button>
                        {showJudgmentDateMenu && (
                          <div className="absolute right-0 top-10 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50">
                            <div className="space-y-3">
                              <div><label className="text-xs font-bold text-slate-500 block mb-1">Start Date</label><input type="date" className="w-full border border-slate-200 rounded p-1.5 text-sm" value={judgmentDateRange.start} onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, start: e.target.value })} /></div>
                              <div><label className="text-xs font-bold text-slate-500 block mb-1">End Date</label><input type="date" className="w-full border border-slate-200 rounded p-1.5 text-sm" value={judgmentDateRange.end} onChange={(e) => setJudgmentDateRange({ ...judgmentDateRange, end: e.target.value })} /></div>
                              <div className="pt-2 border-t border-slate-100 flex justify-end">
                                <button onClick={resetJudgmentDateRange} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Reset</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowExportModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors"><Download className="w-4 h-4" /> Export Report</button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <JudgmentTable results={paginatedJudgment} onSort={requestJudgmentSort} />
                  </div>
                  <PaginationFooter currentPage={judgmentPage} totalItems={processedJudgmentResults.length} itemsPerPage={itemsPerPage} onPageChange={setJudgmentPage} />
                </div>
              </motion.div>
            )}

            {view === 'SETTINGS' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
                  <button onClick={saveSettings} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${settingsSaved ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'}`}>
                    {settingsSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {settingsSaved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">General Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-bold text-slate-700">Dark Mode</p><p className="text-xs text-slate-500">Switch between light and dark themes</p></div>
                        <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-bold text-slate-700">Email Notifications</p><p className="text-xs text-slate-500">Receive daily summaries via email</p></div>
                        <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${appSettings.emailNotifications ? 'bg-indigo-600' : 'bg-slate-200'}`} onClick={() => updateSettings({ emailNotifications: !appSettings.emailNotifications })}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${appSettings.emailNotifications ? 'left-7' : 'left-1'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Inspection Standards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Default AQL Level</label>
                        <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={appSettings.defaultAql} onChange={(e) => updateSettings({ defaultAql: e.target.value })}>
                          <option value="0.65">0.65 (Strict)</option>
                          <option value="1.0">1.0 (Normal)</option>
                          <option value="2.5">2.5 (Loose)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Sampling Standard</label>
                        <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={appSettings.samplingStandard} onChange={(e) => updateSettings({ samplingStandard: e.target.value })}>
                          <option>ISO 2859-1</option>
                          <option>ANSI/ASQ Z1.4</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">User Management</h3>
                    <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-colors">Manage Users & Roles</button>
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