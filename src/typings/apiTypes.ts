import { CompletionStatus } from './enums';

// GENERAL
export interface Project {
    description: string;
    id: number;
    title: string;
}

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

export interface Attachment {
    id: number;
    uri: string;
    title: string;
    createdAt: Date;
    classification: string;
    mimeType: string;
    thumbnailAsBase64: string;
    hasFile: boolean;
    fileName: string;
}

// CHECKLIST
export interface ChecklistDetails {
    id: number;
    tagNo: string;
    tagDescription: string;
    mcPkgNo: string;
    responsibleCode: string;
    responsibleDescription: string;
    status: CompletionStatus;
    systemModule: string;
    formularType: string;
    formularGroup: string;
    comment: string;
    signedByUser: string;
    signedByFirstName: string;
    signedByLastName: string;
    signedAt: Date;
    verifiedByUser: string;
    verifiedByFirstName: string;
    verifiedByLastName: string;
    verifiedAt: Date;
    updatedAt: Date;
    updatedByUser: string;
    updatedByFirstName: string;
    updatedByLastName: string;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
    attachmentCount: number;
}

export interface LoopTag {
    tagId: number;
    tagNo: string;
}

export interface ItemToMultiSignOrVerify {
    id: number;
    tagNo: string;
    tagDescription: string;
}

export interface CustomCheckItem {
    id: number;
    itemNo: string;
    text: string;
    isOk: boolean;
}

export interface ChecklistResponse {
    loopTags: LoopTag[];
    checkList: ChecklistDetails;
    checkItems: CheckItem[];
    customCheckItems: CustomCheckItem[];
}
export interface ColumnLabel {
    id: number;
    label: string;
}

export interface Cell {
    value: string;
    unit: string;
    columnId: number;
}

export interface Row {
    id: number;
    label: string;
    cells: Cell[];
}

export interface MetaTable {
    info: string;
    columnLabels: ColumnLabel[];
    rows: Row[];
}

export interface CheckItem {
    id: number;
    sequenceNumber: string;
    text: string;
    detailText: string;
    isHeading: boolean;
    hasImage: boolean;
    imageFileId: number;
    hasMetaTable: boolean;
    metaTable: MetaTable;
    isOk: boolean;
    isNotApplicable: boolean;
}

export interface ChecklistResponse {
    loopTags: LoopTag[];
    checkList: ChecklistDetails;
    checkItems: CheckItem[];
    customCheckItems: CustomCheckItem[];
}

export interface ChecklistPreview {
    id: number;
    tagId: number;
    tagNo: string;
    tagDescription: string;
    responsibleCode: string;
    status: CompletionStatus;
    formularType: string;
    formularGroup: string;
    sheetNo: number;
    subSheetNo: number;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
    attachmentCount: number;
    isSigned: boolean;
    isVerified: boolean;
}

// Attachments
export interface Attachment {
    id: number;
    uri: string;
    title: string;
    createdAt: Date;
    classification: string;
    mimeType: string;
    thumbnailAsBase64: string;
    hasFile: boolean;
    fileName: string;
}

// Punch
export interface PunchPreview {
    id: number;
    status: CompletionStatus;
    description: string;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    formularType: string;
    responsibleCode: string;
    isRestrictedForUser: boolean;
    cleared: boolean;
    rejected: boolean;
    verified: boolean;
    statusControlledBySwcr: boolean;
    attachmentCount: number;
    callOffNo?: string;
}