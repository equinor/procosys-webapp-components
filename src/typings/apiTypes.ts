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

export interface AttachmentInList {
    id: number;
    fileName: string;
    title: string;
    mimeType: string;
    fileId: number;
    sortKey: number;
    uri?: string;
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
    PunchItemId: number;
    Text: string;
}

// Punch API Comment
export interface APIComment {
    createdAt: Date;
    firstName: string;
    lastName: string;
    text: string;
    id: number;
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
/*
export interface Person {
    id: number;
    azureOid: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}
*/
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
  attachments?: AttachmentData[];
}

// Documents

export interface Document {
    documentId: number;
    documentNo: string;
    title: string;
    revisionNo: string;
    revisionId: number;
    relationType: DocumentRelationType;
    attachments: DocumentAttachment[];
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




type Guid = string;
type DateTimeString = string;  // ISO 8601 date time string

interface User {
  guid: Guid;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
}


interface OrganizationDetail {
  guid: Guid;
  code: string;
  description: string;
}

interface PriorityAndSorting {
  guid: Guid;
  code: string;
  description: string;
}

export interface Document {
  guid: Guid;
  no: string;
}

export interface SWCR {
  guid: Guid;
  no: number;
}

export type NewPunchItem = Pick<PunchListItem, "category" | "description"> & {
  clearingByOrgGuid: string;
  raisedByOrgGuid: string;
};

export interface PunchListItem {
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
  attachments?: AttachmentData[];
}

export interface TagInfo {
  Responsible: string;
  FormType: string;
  TagDescription: string;
  TagNo: string;
  CheckListGuid: string;
}

interface User {
  Id: number;
  UserName: string;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  OfficePhoneNo: null;
  MobilePhoneNo: null;
  IsVoided: boolean;
  NameAndUserNameAsString: string;
  FullName: string;
  FullNameFormal: string;
}

export interface AttachmentData {
  parentGuid: string;
  guid: string;
  fullBlobPath: string;
  sasUri: string;
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
export type MessageType = {
  [index: string]: any;
  show: boolean;
  text?: string;
};
export type PunchContextType = {
  punchGuid: string;
  fetchPunch: (
    guid: string,
    showLoading?: boolean,
    skipCalls?: SkipCallsType
  ) => Promise<unknown>;
  punchData: PunchListItem;
  setPunchData: (p: PunchListItem) => void;
  labels: { picture: string[]; comment: string[] };
  isNewPunch: boolean;
  tagInfo: TagInfo;
  setViewType: (l: viewType) => void;
  setMessage: (e: MessageType) => void;
  viewType: viewType;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (e: boolean) => void;
};

export type viewType = "column" | "list";

export type Person = {
  id: number;
  azureOid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type WorkOrder = {
  no: string;
  guid: string;
};
export type OptionsType = {
  label: string;
  value: string;
  libraryType?: string;
  code?: string;
}[];

export type SkipCallsType = {
  attachments?: boolean;
  comments?: boolean;
  punch?: boolean;
};

