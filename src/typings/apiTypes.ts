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
    valueDate: string;
    isValueDate: boolean;
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

// Tag

export interface TagDetails {
    id: number;
    tagNo: string;
    description: string;
    registerCode: string;
    registerDescription: string;
    statusCode: string;
    statusDescription: string;
    tagFunctionCode: string;
    tagFunctionDescription: string;
    commPkgNo: string;
    mcPkgNo: string;
    purchaseOrderNo: string;
    callOffNo: string;
    purchaseOrderTitle: string;
    projectDescription: string;
    sequence: string;
    mountedOnTagNo: string;
    remark: string;
    systemCode: string;
    systemDescription: string;
    disciplineCode: string;
    disciplineDescription: string;
    areaCode: string;
    areaDescription: string;
    engineeringCodeCode: string;
    engineeringCodeDescription: string;
    contractorCode: string;
    contractorDescription: string;
    hasPreservation: boolean;
    preservationMigrated: boolean;
}

export interface AdditionalTagField {
    id: number;
    label: string;
    value: string;
    type: string;
    unit: string;
}

// Punch pages
export interface Person {
    id: number;
    azureOid: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface PunchCategory {
    id: number;
    code: CompletionStatus;
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

export interface PunchSort {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface PunchPriority {
    id: number;
    code: string;
    description: string;
}

export interface NewPunch {
    CheckListId: number;
    CategoryId: number;
    Description: string;
    TypeId?: number;
    RaisedByOrganizationId: number;
    ClearingByOrganizationId: number;
    SortingId?: number;
    PriorityId?: number;
    ActionByPerson?: number | null;
    DueDate?: string;
    Estimate?: number;
    TemporaryFileIds: string[];
}
