'use client';
import { useState, useCallback } from 'react';
import { Toast } from '@/types';

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 5000);
    }, []);

    return { toasts, addToast };
};
