export enum AsyncStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
    EMPTY_RESPONSE,
}

export enum CompletionStatus {
    OS = 'OS',
    PA = 'PA',
    PB = 'PB',
    OK = 'OK',
}

export type Project = {
    description: string;
    id: number;
    title: string;
};

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

export type ChecklistPreview = {
    id: number;
    tagNo: string;
    tagDescription: string;
    status: CompletionStatus;
    formularType: string;
    formularGroup: string;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
};

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

export interface PunchCategory {
    id: number;
    code: string;
    description: string;
}

export interface PunchType {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface PunchOrganization {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface NewPunch {
    CheckListId: number;
    CategoryId: number;
    Description: string;
    TypeId: number;
    RaisedByOrganizationId: number;
    ClearingByOrganizationId: number;
    TemporaryFileIds: string[];
}

export interface PunchItem {
    id: number;
    checklistId: number;
    formularType: string;
    status: string;
    description: string;
    typeCode: string;
    typeDescription: string;
    raisedByCode: string;
    raisedByDescription: string;
    clearingByCode: string;
    clearingByDescription: string;
    clearedAt?: null;
    clearedByUser?: null;
    clearedByFirstName?: null;
    clearedByLastName?: null;
    verifiedAt?: null;
    verifiedByUser?: null;
    verifiedByFirstName?: null;
    verifiedByLastName?: null;
    rejectedAt?: null;
    rejectedByUser?: null;
    rejectedByFirstName?: null;
    rejectedByLastName?: null;
    dueDate?: null;
    estimate?: null;
    priorityId?: null;
    priorityCode?: null;
    priorityDescription?: null;
    actionByPerson: number;
    actionByPersonFirstName?: null;
    actionByPersonLastName?: null;
    materialRequired: boolean;
    materialEta?: null;
    materialNo?: null;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    responsibleCode: string;
    responsibleDescription: string;
    sorting?: null;
    statusControlledBySwcr: boolean;
    isRestrictedForUser: boolean;
    attachmentCount: number;
}

export interface Task {
    id: number;
    number: string;
    title: string;
    descriptionAsHtml: string;
    commentAsHtml: string;
    updatedByUser: string;
    updatedAt: Date;
    updatedByFirstName: string;
    updatedByLastName: string;
    signedByUser: string;
    signedByFirstName: string;
    signedByLastName: string;
    signedAt: Date;
}

export interface TaskParameter {
    id: number;
    description: string;
    measuredValue: string;
    referenceValue: string;
    referenceUnit: string;
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
