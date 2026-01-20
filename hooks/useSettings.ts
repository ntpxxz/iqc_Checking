'use client';
import { useState } from 'react';
import { AppSettings } from '@/types';

const INITIAL_SETTINGS: AppSettings = {
    emailNotifications: true,
    autoPrintLabel: false,
    defaultAql: '0.65',
    samplingStandard: 'ISO 2859-1',
    language: 'English'
};

export const useSettings = () => {
    const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return { settings, updateSettings };
};
