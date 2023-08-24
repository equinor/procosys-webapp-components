export enum StorageKey {
    PLANT = 'currentPlant',
    PROJECT = 'currentProject',
    BOOKMARK = 'Procosys Bookmark',
    MC_REDIRECTPATH = 'ProCoSys-MCWA-redirectPath',
    COMM_REDIRECTPATH = 'ProCoSys-CWA-redirectPath',
}

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

export enum SearchStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
}

export enum PunchAction {
    CLEAR = 'Clear',
    UNCLEAR = 'Unclear',
    REJECT = 'Reject',
    VERIFY = 'Verify',
    UNVERIFY = 'Unverify',
}

export enum PunchFields {
    CATEGORY = 'category',
    DESCRIPTION = 'description',
    RAISED_BY = 'raisedBy',
    CLEARING_BY = 'clearingBy',
    PERSON = 'actionByPerson',
    DUE_DATE = 'dueDate',
    TYPE = 'type',
    SORTING = 'sorting',
    PRIORITY = 'priority',
    ESTIMATE = 'estimate',
}

export enum DocumentRelationType {
    BOUNDARY = 'Boundary',
    OTHER = 'Other',
}

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
    IPO = 'IPO',
}

// offine
export enum EntityType {
    ChecklistPunchlist = 'ChecklistPunchlist',
    AuthConfig = 'AuthConfig',
    AppConfig = 'AppConfig',
    Bookmarks = 'Bookmarks',
    Permissions = 'Permissions',
    Plants = 'Plants',
    Projects = 'Projects',
    PunchCategories = 'PunchCategories',
    PunchOrganization = 'PunchOrganization',
    PunchPriorities = 'PunchPriorities',
    PunchSorts = 'PunchSorts',
    PunchTypes = 'PunchTypes',
    EntityDetails = 'EntityDetails',
    Punchlist = 'Punchlist',
    Checklists = 'Checklists',
    WorkOrder = 'WorkOrder',
    WorkOrderAttachments = 'WorkOrderAttachments',
    WorkOrderAttachment = 'WorkOrderAttachment',
    Checklist = 'Checklist',
    Tag = 'Tag',
    PunchItem = 'PunchItem',
    PunchAttachments = 'PunchAttachments',
    PunchAttachment = 'PunchAttachment',
    ChecklistAttachments = 'ChecklistAttachments',
    ChecklistAttachment = 'ChecklistAttachment',
    PunchComments = 'PunchComments',
}

export enum OfflineStatus {
    ONLINE,
    OFFLINE,
    SYNCHING,
    SYNC_FAIL,
}

export enum LocalStorage {
    LOGIN_TRIES = 'loginTries',
    OFFLINE_PROJECT_ID = 'offlineProjectId',
    OFFLINE_STATUS = 'offlineStatus',
    SYNCH_ERRORS = 'SynchErrors',
    SW_UPDATE = 'serviceWorkerUpdate',
}
