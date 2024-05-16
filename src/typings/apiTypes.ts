import { CompletionStatus, DocumentRelationType } from './enums';

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

export interface AttachmentInList {
    id: number;
    fileName: string;
    title: string;
    mimeType: string;
    fileId: number;
    sortKey: number;
    uri?: string;
    sasUri?: string;
}

// CHECKLIST
export interface ChecklistDetails {
    id: number;
    tagNo: string;
    tagDescription: string;
    tagId: number;
    mcPkgNo: string;
    responsibleCode: string;
    responsibleDescription: string;
    status: CompletionStatus;
    systemModule: string;
    formularType: string;
    formularGroup: string;
    comment: string;
    signedByUser: string | null;
    signedByFirstName: string | null;
    signedByLastName: string | null;
    signedAt: Date | null;
    verifiedByUser: string | null;
    verifiedByFirstName: string | null;
    verifiedByLastName: string | null;
    verifiedAt: Date | null;
    updatedAt: Date;
    updatedByUser: string;
    updatedByFirstName: string;
    updatedByLastName: string;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
    attachmentCount: number;
    partOfCertificateSentToCommissioning: boolean;
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
    text: string | null;
    detailText: string | null;
    isHeading: boolean;
    hasImage: boolean;
    imageFileId: number;
    hasMetaTable: boolean;
    metaTable: MetaTable | null;
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
    mcPkgId?: number;
    mcPkgNo?: string;
    responsibleCode: string;
    status: CompletionStatus;
    formularType: string;
    formularGroup: string;
    sheetNo?: number;
    subSheetNo?: number;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
    attachmentCount: number;
    isSigned: boolean;
    isVerified: boolean;
}

// Attachments
export interface Attachment extends AttachmentData {
    id: number;
    uri: string;
    title: string;
    createdAt: Date;
    classification: string;
    mimeType: string;
    thumbnailAsBase64: string;
    hasFile: boolean;
    fileName: string;
    sasUri?: string
}

// Punch
export interface PunchPreview {
    id: number;
    proCoSysGuid: string;
    status: CompletionStatus;
    description: string;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    mcPkgId?: number;
    mcPkgNo?: string;
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

// Punch Comment
export interface PunchComment {
    labels: string[];
    text: string;
    mentions: string[];
}

// Punch API Comment
export interface APIComment {
    createdAt: Date;
    createdAtUtc: Date;
    firstName: string;
    lastName: string;
    text: string;
    id: number;
    guid: string;
    createdBy: User
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
export interface Type {
    guid: Guid;
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
    checkListGuid: number;
    category: number;
    description: string;
    typeGuid?: number;
    raisedByOrgGuid: number;
    clearingByOrgGuid: number;
    sortingGuid?: number;
    priorityGuid?: number;
    actionByPersonGuid?: number | null;
    dueTimeUtc?: string;
    estimate?: number;
    TemporaryFileIds?: string[];
}

// export interface PunchItem {
//     id: number;
//     checklistId: number;
//     formularType: string;
//     status: CompletionStatus;
//     description: string;
//     typeCode: string;
//     typeDescription: string;
//     raisedByCode: string;
//     raisedByDescription: string;
//     clearingByCode: string;
//     clearingByDescription: string;
//     clearedAt: string | null;
//     clearedByUser: string | null;
//     clearedByFirstName: string | null;
//     clearedByLastName: string | null;
//     verifiedAt: string | null;
//     verifiedByUser: string | null;
//     verifiedByFirstName: string | null;
//     verifiedByLastName: string | null;
//     rejectedAt: string | null;
//     rejectedByUser: string | null;
//     rejectedByFirstName: string | null;
//     rejectedByLastName: string | null;
//     dueDate: string | null;
//     estimate: number | null;
//     priorityId: number | null;
//     priorityCode: string | null;
//     priorityDescription: string | null;
//     actionByPerson: number | null;
//     actionByPersonFirstName: string | null;
//     actionByPersonLastName: string | null;
//     materialRequired: boolean;
//     materialEta: string | null;
//     materialNo: string | null;
//     systemModule: string;
//     tagDescription: string;
//     tagId: number;
//     tagNo: string;
//     responsibleCode: string;
//     responsibleDescription: string;
//     sorting: string | null;
//     statusControlledBySwcr: boolean;
//     isRestrictedForUser: boolean;
//     attachmentCount: number;
// }

export type WorkOrder = {
    no: string;
    guid: string;
  };
  export interface AttachmentData {
    parentGuid: string;
    guid: string;
    fullBlobPath: string;
    sasUri?: string;
    fileName: string;
    description: string;
    labels: string[];
    createdBy: {
      guid: string;
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
    } | null;
    createdAtUtc: string | null;
    modifiedBy: {
      guid: string;
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
    } | null;
    modifiedAtUtc: string | null;
    rowVersion: string;
  }
  interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    officePhoneNo: null;
    mobilePhoneNo: null;
    isVoided: boolean;
    nameAndUserNameAsString: string;
    fullName: string;
    fullNameFormal: string;
  }
type Guid = string;
type DateTimeString = string;

export interface OrganizationDetail {
    guid: Guid;
    code: string;
    description: string;
  }
  
  export interface PriorityAndSorting {
    guid: Guid;
    code: string;
    description: string;
  }

  export interface LibrayTypes {
    guid: string;
    libraryType: string;
    code: string;
    description: string;
  }

  export interface SWCR {
    guid: Guid;
    no: number;
  }
export interface PunchItem {
    [index: string]: any;
    guid: Guid;
    projectName: string;
    itemNo: number;
    category: string;
    description: string;
    createdBy: User;
    createdAtUtc: DateTimeString;
    modifiedBy: User;
    modifiedAtUtc: DateTimeString;
    isReadyToBeCleared: boolean;
    isReadyToBeUncleared: boolean;
    clearedBy: User;
    clearedAtUtc: DateTimeString;
    isReadyToBeRejected: boolean;
    rejectedBy: User;
    rejectedAtUtc: DateTimeString;
    isReadyToBeVerified: boolean;
    isReadyToBeUnverified: boolean;
    verifiedBy: User;
    verifiedAtUtc: DateTimeString;
    raisedByOrg: OrganizationDetail;
    clearingByOrg: OrganizationDetail;
    priority: PriorityAndSorting;
    sorting: PriorityAndSorting;
    type: PriorityAndSorting;
    actionBy: User;
    dueTimeUtc: DateTimeString;
    estimate: number;
    externalItemNo: string;
    materialRequired: boolean;
    materialETAUtc: DateTimeString;
    materialExternalNo: string;
    workOrder: WorkOrder;
    originalWorkOrder: WorkOrder;
    document: Document;
    swcr: SWCR;
    rowVersion: string;
    attachments?: Attachment[];
    attachmentCount: number;
  }
// Documents

export interface Document extends DocumentData {
    documentId: number;
    documentNo: string;
    title: string;
    revisionNo: string;
    revisionId: number;
    relationType: DocumentRelationType;
    attachments: DocumentAttachment[];
}

export interface DocumentData {
    guid: Guid;
    no: string;
  }

export interface DocumentAttachment {
    id: number;
    fileName: string;
    title: string;
    mimeType: string;
    fileId: number;
    sortKey: number;
    uri?: string;
}
