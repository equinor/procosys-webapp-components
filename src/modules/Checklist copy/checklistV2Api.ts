import {
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
}
