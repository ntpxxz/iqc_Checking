'use client';
import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Trigger Sync
            await fetch('/api/sync', { method: 'POST' });

            // 2. Fetch Tasks
            const res = await fetch('/api/tasks');
            const data = await res.json();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
        // Poll every 30 seconds for new tasks
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, [fetchTasks]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const processedTasks = tasks.filter(item => {
        if (filterText && !Object.values(item).some(val => String(val).toLowerCase().includes(filterText.toLowerCase()))) return false;
        if (dateRange.start && item.receivedAt < dateRange.start) return false;
        if (dateRange.end && item.receivedAt > dateRange.end) return false;
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
        refreshTasks: fetchTasks
    };
};
