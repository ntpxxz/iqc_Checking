'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/features/dashboard/DashboardView';
import { InspectionView } from '@/components/features/inspection/InspectionView';
import { ResultView } from '@/components/features/inspection/ResultView';
import { HistoryLayout } from '@/components/features/history/HistoryLayout';
import { SettingsView } from '@/components/features/settings/SettingsView';

import { DetailModal } from '@/components/modals/DetailModal';
import { RejectModal } from '@/components/modals/RejectModal';
import { ToastContainer } from '@/components/ui/Toast';

import { useTasks } from '@/hooks/useTasks';
import { useJudgment } from '@/hooks/useJudgment';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/useToast';
import { Task, InspectionRecord } from '@/types';

export default function Page() {
  const { status } = useSession();
  const [view, setView] = useState('DASHBOARD');
  const { toasts, addToast } = useToast();

  // Modals & Active State
  const [activeJob, setActiveJob] = useState<Task | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [manualVerdict, setManualVerdict] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<any | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Dashboard State
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showJudgmentDateMenu, setShowJudgmentDateMenu] = useState(false);

  // Pagination
  const [queuePage, setQueuePage] = useState(1);
  const [judgmentPage, setJudgmentPage] = useState(1);
  const itemsPerPage = 10;

  // Notifications
  const [notifications, setNotifications] = useState<Task[]>([]);

  const handleNewTasks = useCallback((count: number, newTasks: Task[]) => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => { });
    } catch (e) { }

    if (count === 1) {
      const task = newTasks[0];
      addToast(`📦 New task: ${task.part} from ${task.vendor}`, 'warning');
    } else {
      addToast(`📦 ${count} new tasks incoming!!`, 'warning');
    }
    setNotifications(prev => [...newTasks, ...prev]);
  }, [addToast]);

  const taskOptions = useMemo(() => ({ onNewTasks: handleNewTasks }), [handleNewTasks]);
  const {
    tasks: processedTasks,
    loading: dataLoading,
    filterText,
    setFilterText,
    dateRange,
    setDateRange,
    requestSort,
    removeTask,
    warehouseFilter,
    setWarehouseFilter,
    warehouses,
    refreshTasks
  } = useTasks(taskOptions);

  const {
    results: processedJudgmentResults,
    filterText: judgmentFilterText,
    setFilterText: setJudgmentFilterText,
    dateRange: judgmentDateRange,
    setDateRange: setJudgmentDateRange,
    requestSort: requestJudgmentSort,
    addResult
  } = useJudgment();

  const { settings: appSettings, updateSettings } = useSettings();

  // Column Visibility
  const columnLabels: Record<string, string> = {
    urgent: 'Urgent', id: 'ID', receivedAt: 'Received', warehouse: 'Warehouse',
    invoice: 'Invoice No', part: 'Part No', partName: 'Part Name', qty: 'Qty', iqcStatus: 'Status'
  };

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.keys(columnLabels).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  // --- EFFECTS ---
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

  const handleStartInspection = (task: Task) => {
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
      setView('INSPECT');
    }, 400);
  };

  const handleRejectClick = () => {
    setManualVerdict('FAIL');
    setShowRejectModal(true);
  };

  const confirmReject = (remark: string) => {
    submitInspection('FAIL', remark);
    setShowRejectModal(false);
  };

  const submitInspection = async (finalVerdictOverride: string | null = null, remark: string = '-') => {
    const finalV = finalVerdictOverride || manualVerdict;
    if (!finalV || !activeJob) return;

    setVerdict(finalV);
    setView('RESULT');

    const inspectionData = {
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      lotIqc: activeJob.lotNo,
      partNo: activeJob.part,
      partName: activeJob.partName,
      supplier: activeJob.vendor,
      shipLot: '-',
      invoiceNo: activeJob.invoice,
      rev: activeJob.rev,
      country: '-',
      judgment: finalV,
      actionLot: finalV === 'PASS' ? 'Release to WH' : 'Hold',
      remark: remark,
      inspector: 'Jane Doe',
      qty: activeJob.qty,
      status: finalV === 'PASS' ? 'PASSED' : 'REJECTED',
      samplingType: activeJob.samplingType
    };

    await addResult(inspectionData);

    removeTask(activeJob.id);
    addToast(finalV === 'PASS' ? 'Inspection Passed' : 'Lot Rejected & Quarantined', finalV === 'PASS' ? 'success' : 'error');
  };

  const handleManualSync = async () => {
    const count = await refreshTasks();
    if (count > 0) {
      addToast(`Successfully synced ${count} new tasks`, 'success');
    } else {
      addToast('Sync complete. No new tasks found.', 'info');
    }
  };

  const returnToDashboard = () => {
    setFilterText('');
    setActiveJob(null);
    setVerdict(null);
    setManualVerdict(null);
    setView('DASHBOARD');
  };

  // Pagination Logic
  const paginatedQueue = useMemo(() => {
    const start = (queuePage - 1) * itemsPerPage;
    return processedTasks.slice(start, start + itemsPerPage);
  }, [processedTasks, queuePage]);

  const paginatedJudgment = useMemo(() => {
    const start = (judgmentPage - 1) * itemsPerPage;
    return processedJudgmentResults.slice(start, start + itemsPerPage);
  }, [processedJudgmentResults, judgmentPage]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#ffe500]" />
          <p className="text-sm font-bold text-[#605E5C]">Preparing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAF9F8] text-[#323130] overflow-hidden flex-col">
      <Header
        view={view}
        setView={setView}
        filterText={filterText}
        setFilterText={setFilterText}
        notifications={notifications}
        onNotificationClick={() => setNotifications([])}
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
        <ToastContainer toasts={toasts} />
        <RejectModal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} onConfirm={confirmReject} />
        <DetailModal item={showDetailModal} onClose={() => setShowDetailModal(null)} />

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            {view === 'DASHBOARD' && (
              <DashboardView
                processedTasks={processedTasks}
                recentHistory={processedJudgmentResults}
                selectedItems={selectedItems}
                visibleColumns={visibleColumns}
                toggleColumn={toggleColumn}
                showColumnMenu={showColumnMenu}
                setShowColumnMenu={setShowColumnMenu}
                columnLabels={columnLabels}
                showDateMenu={showDateMenu}
                setShowDateMenu={setShowDateMenu}
                dateRange={dateRange}
                setDateRange={setDateRange}
                resetDateRange={resetDateRange}
                warehouseFilter={warehouseFilter}
                setWarehouseFilter={setWarehouseFilter}
                warehouses={warehouses}
                dataLoading={dataLoading}
                paginatedQueue={paginatedQueue}
                queuePage={queuePage}
                setQueuePage={setQueuePage}
                itemsPerPage={itemsPerPage}
                handleSelectAll={handleSelectAll}
                handleSelectItem={handleSelectItem}
                handleStartInspection={handleStartInspection}
                requestSort={requestSort}
                refreshTasks={handleManualSync}
              />
            )}

            {view === 'INSPECT' && activeJob && (
              <InspectionView
                activeJob={activeJob}
                manualVerdict={manualVerdict}
                setManualVerdict={setManualVerdict}
                returnToDashboard={returnToDashboard}
                handleRejectClick={handleRejectClick}
                submitInspection={submitInspection}
              />
            )}

            {view === 'RESULT' && (
              <ResultView
                verdict={verdict}
                activeJob={activeJob}
                returnToDashboard={returnToDashboard}
              />
            )}

            {view === 'HISTORY' && (
              <HistoryLayout
                itemsPerPage={itemsPerPage}
                setShowDetailModal={setShowDetailModal}
                showJudgmentDateMenu={showJudgmentDateMenu}
                setShowJudgmentDateMenu={setShowJudgmentDateMenu}
                judgmentDateRange={judgmentDateRange}
                setJudgmentDateRange={setJudgmentDateRange}
                resetJudgmentDateRange={resetJudgmentDateRange}
                setShowExportModal={setShowExportModal}
                paginatedJudgment={paginatedJudgment}
                judgmentPage={judgmentPage}
                setJudgmentPage={setJudgmentPage}
                processedJudgmentResults={processedJudgmentResults}
                requestJudgmentSort={requestJudgmentSort}
              />
            )}

            {view === 'SETTINGS' && (
              <SettingsView
                settings={appSettings}
                setSettings={updateSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
