'use client';
import { useState, useEffect } from 'react';
import { HistoryItem } from '@/types';

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/inspections');
            const data = await res.json();
            // Map API data to HistoryItem format if needed, but they should match now
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const addHistoryItem = (item: HistoryItem) => {
        setHistory(prev => [item, ...prev]);
    };

    return { history, loading, addHistoryItem, refreshHistory: fetchHistory };
};
