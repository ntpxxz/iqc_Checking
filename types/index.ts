export interface InboundTask {
    id: string;
    status: 'PENDING' | 'IQC_WAITING' | 'IQC_IN_PROGRESS' | 'IQC_PASSED_WAITING_STOCK' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

    // Tagging
    tagNo?: string;

    // Invoice/PO Document
    invoiceNo: string;
    poNo?: string;
    vendor: string;

    // Part Info
    partId?: string;
    partNo: string;
    partName?: string;

    // Traceability
    lotNo?: string;
    rev?: string;
    mfgDate?: string | Date;

    // Quantity
    planQty: number;
    actualQty: number;

    // IQC Inspection Flow
    receivedBy?: string;
    receivedAt?: string | Date;
    receiverNote?: string;
    assignedTo?: string;
    startedAt?: string | Date;
    finishedAt?: string | Date;

    // Warehouse Integration
    targetLocation?: string;

    // Meta
    dueDate?: string | Date;
    isUrgent: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;

    // Legacy compatibility fields
    invoice?: string;     // Maps to invoiceNo
    part?: string;        // Maps to partNo
    qty?: number;         // Maps to planQty
    iqcStatus?: string;   // Maps to status
    receiver?: string;    // Maps to receivedBy
    samplingType?: string;
    totalSampling?: number;
    aql?: string;

    requirements?: {
        sampleSize: number;
        majorLimit: number;
        minorLimit: number;
        code: string;
    };
}

// Keep for backward compatibility
export type Task = InboundTask;

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
    invoice: string;
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

export interface User {
    id: string;
    name: string;
    email?: string;
    password?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
