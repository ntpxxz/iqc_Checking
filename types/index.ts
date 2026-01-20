export interface Task {
    id: string;
    receivedAt: string;
    inspectionType: string;
    invoice: string;
    lotNo: string;
    model: string;
    partName: string;
    part: string;
    rev: string;
    vendor: string;
    qty: number;
    receiver: string;
    issue: string;
    timestamp: string;
    iqcStatus: string;
    grn: string;
    mfgDate: string;
    location: string;
    samplingType: string;
    totalSampling: number;
    aql: string;
    urgent: boolean;
    requirements?: {
        sampleSize: number;
        majorLimit: number;
        minorLimit: number;
        code: string;
    };
}

export interface Toast {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
}

export interface HistoryItem {
    id: string;
    lotNo: string;
    part: string;
    partName: string;
    vendor: string;
    qty: number;
    status: string;
    date: string;
    time: string;
    inspector: string;
}

export interface JudgmentResult {
    date: string;
    lotIqc: string;
    partNo: string;
    supplier: string;
    shipLot: string;
    invoiceNo: string;
    rev: string;
    country: string;
    judgment: string;
    actionLot: string;
    remark: string;
}

export interface AppSettings {
    emailNotifications: boolean;
    autoPrintLabel: boolean;
    defaultAql: string;
    samplingStandard: string;
    language: string;
}
