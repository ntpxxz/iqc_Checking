'use client';
import { useState, useMemo, useEffect } from 'react';
import { InspectionRecord } from '@/types';

export const useJudgment = () => {
    const [results, setResults] = useState<InspectionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/inspections');
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Failed to fetch judgment results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const parseDate = (dateStr: string) => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        return new Date(dateStr);
    };

    const processedResults = useMemo(() => {
        let sortableItems = [...results];
        if (filterText) {
            sortableItems = sortableItems.filter(item =>
                Object.values(item).some(val => String(val).toLowerCase().includes(filterText.toLowerCase()))
            );
        }
        if (dateRange.start) {
            const start = new Date(dateRange.start);
            start.setHours(0, 0, 0, 0);
            sortableItems = sortableItems.filter(item => parseDate(item.date) >= start);
        }
        if (dateRange.end) {
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999);
            sortableItems = sortableItems.filter(item => parseDate(item.date) <= end);
        }
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                // @ts-ignore
                let valA = a[sortConfig.key];
                // @ts-ignore
                let valB = b[sortConfig.key];
                if (sortConfig.key === 'date') {
                    valA = parseDate(valA).getTime();
                    valB = parseDate(valB).getTime();
                }
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [results, filterText, sortConfig, dateRange]);

    const addResult = async (result: any) => {
        try {
            const res = await fetch('/api/inspections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result)
            });
            if (res.ok) {
                const savedResult = await res.json();
                setResults(prev => [savedResult, ...prev]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to save judgment result:', error);
            return false;
        }
    };

    return {
        results: processedResults,
        loading,
        filterText,
        setFilterText,
        dateRange,
        setDateRange,
        requestSort,
        addResult,
        refreshResults: fetchResults
    };
};
