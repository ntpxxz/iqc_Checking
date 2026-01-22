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
    warehouse: string;
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
    sampleSize?: number;
    majorLimit?: number;
    minorLimit?: number;
    code?: string;
}

export interface Toast {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

export interface InspectionRecord {
    id: string;
    date: string;
    lotIqc: string;
    partNo: string;
    partName: string;
    supplier: string;
    shipLot: string;
    invoiceNo: string;
    rev: string;
    country: string;
    judgment: string;
    actionLot: string;
    remark: string;
    time: string;
    inspector: string;
    qty: number;
    status: string;
    samplingType: string;
    createdAt: string;
}

export interface AppSettings {
    emailNotifications: boolean;
    autoPrintLabel: boolean;
    defaultAql: string;
    samplingStandard: string;
    language: string;
}
