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
