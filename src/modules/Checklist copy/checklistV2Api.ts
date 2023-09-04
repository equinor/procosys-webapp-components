import {
    Attachment,
    ChecklistResponse,
    ItemToMultiSignOrVerify,
} from '../../typings/apiTypes';

export default interface ChecklistV2Api {
    postMultiVerify: (
        plantId: string,
        checklistId: string,
        targetChecklistIds: number[]
    ) => Promise<void>;
    postMultiSign: (
        plantId: string,
        checklistId: string,
        targetChecklistIds: number[],
        copyMetaTable: boolean
    ) => Promise<void>;
    putChecklistComment: (
        plantId: string,
        checklistId: string,
        comment: string
    ) => Promise<void>;
    postUnsign: (plantId: string, checklistId: string) => Promise<void>;
    postSign: (plantId: string, checklistId: string) => Promise<void>;
    getCanMultiSign: (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ) => Promise<ItemToMultiSignOrVerify[]>;
    postUnverify: (plantId: string, checklistId: string) => Promise<void>;
    postVerify: (plantId: string, checklistId: string) => Promise<void>;
    getCanMultiVerify: (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ) => Promise<ItemToMultiSignOrVerify[]>;
    getChecklist: (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ) => Promise<ChecklistResponse>;
    postSetOk: (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => Promise<void>;
    postCustomSetOk: (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ) => Promise<void>;
    postClear: (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => Promise<void>;
    postCustomClear: (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ) => Promise<void>;
    postSetNA: (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => Promise<void>;
    putMetaTableStringCell: (
        plantId: string,
        checklistId: string,
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ) => Promise<void>;
    putMetaTableDateCell: (
        plantId: string,
        checklistId: string,
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ) => Promise<void>;
    getNextCustomItemNumber: (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ) => Promise<string>;
    postCustomCheckItem: (
        plantId: string,
        checklistId: string,
        itemNo: string,
        text: string,
        isOk: boolean
    ) => Promise<number>;
    deleteCustomCheckItem: (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ) => Promise<void>;
    getChecklistAttachments: (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ) => Promise<Attachment[]>;
    getChecklistAttachment: (
        plantId: string,
        checklistId: string,
        attachmentId: number,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    postChecklistAttachment: (
        plantId: string,
        checklistId: string,
        data: FormData,
        title?: string
    ) => Promise<void>;
    deleteChecklistAttachment: (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ) => Promise<void>;
}
