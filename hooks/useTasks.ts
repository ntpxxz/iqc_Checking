'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/types';

interface UseTasksOptions {
    onNewTasks?: (count: number, newTasks: Task[]) => void;
}

export const useTasks = (options?: UseTasksOptions) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
    const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
    const previousTaskIdsRef = useRef<Set<string>>(new Set());
    const isFirstFetchRef = useRef(true);
    const isFetchingRef = useRef(false);

    const fetchTasks = useCallback(async () => {
        if (isFetchingRef.current) return 0;
        isFetchingRef.current = true;
        setLoading(true);
        let syncedCount = 0;
        try {
            console.log('🔄 Starting task fetch and sync...');

            // 1. Trigger Sync
            const syncRes = await fetch('/api/sync', { method: 'POST' });
            const syncData = await syncRes.json();
            syncedCount = syncData.syncedCount || 0;
            console.log('✅ Sync complete:', syncData);

            // 2. Fetch Tasks
            const res = await fetch('/api/tasks', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const data: Task[] = await res.json();
            console.log(`📦 Fetched ${data.length} tasks from database`);
            console.log('Tasks data:', data);

            // 3. Check for new tasks
            if (options?.onNewTasks) {
                const newTasks = data.filter(task => !previousTaskIdsRef.current.has(task.id));

                if (newTasks.length > 0) {
                    // Only notify if it's not the very first fetch of the session
                    if (!isFirstFetchRef.current) {
                        console.log(`🆕 Found ${newTasks.length} new tasks`);
                        options.onNewTasks(newTasks.length, newTasks);
                    }
                }
            }

            // Update previous task IDs
            previousTaskIdsRef.current = new Set(data.map(t => t.id));
            isFirstFetchRef.current = false;

            setTasks(data);
            return syncedCount;
        } catch (error) {
            console.error('❌ Failed to fetch tasks:', error);
            return 0;
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [options]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Get unique warehouses for filter dropdown
    const warehouses = [...new Set(tasks.map(t => t.warehouse || 'Main'))];

    const processedTasks = tasks.filter(item => {
        if (filterText && !Object.values(item).some(val => String(val).toLowerCase().includes(filterText.toLowerCase()))) return false;
        if (dateRange.start && item.receivedAt < dateRange.start) return false;
        if (dateRange.end && item.receivedAt > dateRange.end) return false;
        if (warehouseFilter !== 'all' && item.warehouse !== warehouseFilter) return false;
        return true;
    }).sort((a, b) => {
        if (!sortConfig.key) return 0;
        // @ts-ignore
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        // @ts-ignore
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const removeTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        previousTaskIdsRef.current.delete(id);
    };

    return {
        tasks: processedTasks,
        loading,
        filterText,
        setFilterText,
        dateRange,
        setDateRange,
        requestSort,
        removeTask,
        refreshTasks: fetchTasks,
        warehouseFilter,
        setWarehouseFilter,
        warehouses
    };
};
