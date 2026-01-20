'use client';
import { useState } from 'react';
import { HistoryItem } from '@/types';

const INITIAL_HISTORY: HistoryItem[] = [
    { id: 'LOT-2023-884', lotNo: 'LOT-2023-884', part: 'GEAR-BOX-A', partName: 'Gear Box Type A', vendor: 'TechMfg Solutions', qty: 1200, status: 'RELEASED', date: '15/01/2026', time: '14:30', inspector: 'Jane Doe' },
    { id: 'LOT-2023-882', lotNo: 'LOT-2023-882', part: 'LENS-OPTIC-22', partName: 'Optical Lens 22mm', vendor: 'Optico Inc', qty: 40, status: 'QUARANTINE', date: '15/01/2026', time: '10:15', inspector: 'Jane Doe' },
    { id: 'LOT-2023-881', lotNo: 'LOT-2023-881', part: 'SCREW-M4', partName: 'Screw M4x10', vendor: 'Fastener World', qty: 50000, status: 'RELEASED', date: '14/01/2026', time: '16:45', inspector: 'John Smith' },
    { id: 'LOT-2023-880', lotNo: 'LOT-2023-880', part: 'HOUSING-MAIN', partName: 'Plastic Housing', vendor: 'Plastico Ltd', qty: 500, status: 'RELEASED', date: '14/01/2026', time: '09:20', inspector: 'Jane Doe' },
    { id: 'LOT-2023-879', lotNo: 'LOT-2023-879', part: 'PCB-ASSY-01', partName: 'Main Board', vendor: 'Circuitry Co', qty: 200, status: 'QUARANTINE', date: '13/01/2026', time: '11:00', inspector: 'Mike Ross' },
];

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);

    const addHistoryItem = (item: HistoryItem) => {
        setHistory(prev => [item, ...prev]);
    };

    return { history, addHistoryItem };
};
