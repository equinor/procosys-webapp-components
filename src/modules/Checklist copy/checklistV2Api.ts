import {
    Attachment,
    ChecklistResponse,
    ItemToMultiSignOrVerify,
} from '../../typings/apiTypes';

export default interface ChecklistV2Api {
    postMultiVerify: (targetChecklistIds: number[]) => Promise<void>;
    postMultiSign: (
        targetChecklistIds: number[],
        copyMetaTable: boolean
    ) => Promise<void>;
    putChecklistComment: (comment: string) => Promise<void>;
    postUnsign: () => Promise<void>;
    postSign: () => Promise<void>;
    getCanMultiSign: (
        abortSignal?: AbortSignal
    ) => Promise<ItemToMultiSignOrVerify[]>;
    postUnverify: () => Promise<void>;
    postVerify: () => Promise<void>;
    getCanMultiVerify: (
        abortSignal?: AbortSignal
    ) => Promise<ItemToMultiSignOrVerify[]>;
    getChecklist: (abortSignal?: AbortSignal) => Promise<ChecklistResponse>;
    postSetOk: (checkItemId: number) => Promise<void>;
    postCustomSetOk: (customCheckItemId: number) => Promise<void>;
    postClear: (checkItemId: number) => Promise<void>;
    postCustomClear: (customCheckItemId: number) => Promise<void>;
    postSetNA: (checkItemId: number) => Promise<void>;
    putMetaTableStringCell: (
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ) => Promise<void>;
    putMetaTableDateCell: (
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ) => Promise<void>;
    getNextCustomItemNumber: (abortSignal?: AbortSignal) => Promise<string>;
    postCustomCheckItem: (
        itemNo: string,
        text: string,
        isOk: boolean
    ) => Promise<number>;
    deleteCustomCheckItem: (customCheckItemId: number) => Promise<void>;
    getChecklistAttachments: (
        abortSignal?: AbortSignal
    ) => Promise<Attachment[]>;
    getChecklistAttachment: (
        attachmentId: number,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    postChecklistAttachment: (data: FormData, title?: string) => Promise<void>;
    deleteChecklistAttachment: (attachmentId: number) => Promise<void>;
}
