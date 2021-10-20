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
