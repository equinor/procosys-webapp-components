import { CustomCheckItemDto } from '../modules/Checklist/CheckItems/CustomCheckItems';
import {
    isArrayOfAttachments,
    isArrayOfItemToMultiSignOrVerify,
    isChecklistResponse,
    isNextAvailableNumber,
} from './apiTypeGuards';
import {
    ChecklistResponse,
    Attachment,
    ItemToMultiSignOrVerify,
} from '../typings/apiTypes';
import {
    deleteByFetch,
    getAttachmentByFetch,
    getByFetch,
    postAttachmentByFetch,
    postByFetch,
    putByFetch,
} from './apiHelpers';
import { ProcosysApiSettings } from '../typings/helperTypes';

type ProcosysApiServiceProps = {
    apiSettings: ProcosysApiSettings;
    apiVersion: string;
    plantId: string;
    checklistId: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = ({
    apiSettings,
    apiVersion,
    plantId,
    checklistId,
}: ProcosysApiServiceProps) => {
    const getPermissions = async (): Promise<string[]> => {
        const data = await getByFetch(
            apiSettings,
            `Permissions?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as string[];
    };

    const getChecklist = async (
        abortSignal: AbortSignal
    ): Promise<ChecklistResponse> => {
        const data = await getByFetch(
            apiSettings,
            `CheckList/MC?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isChecklistResponse(data)) {
            throw new TypeError(
                'The received item was not a checklist response'
            );
        }
        return data;
    };

    const postSetOk = async (checkItemId: number): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postSetNA = async (checkItemId: number): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postClear = async (checkItemId: number): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/Item/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postCustomClear = async (
        customCheckItemId: number
    ): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/CustomItem/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CustomCheckItemId: customCheckItemId,
            }
        );
    };
    const postCustomSetOk = async (
        customCheckItemId: number
    ): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/CustomItem/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CustomCheckItemId: customCheckItemId,
            }
        );
    };

    const postCustomCheckItem = async (
        dto: CustomCheckItemDto
    ): Promise<number> => {
        const data = await postByFetch(
            apiSettings,
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            { ...dto, ChecklistId: checklistId }
        );
        return data.Id;
    };

    const deleteCustomCheckItem = async (
        customCheckItemId: number
    ): Promise<void> => {
        await deleteByFetch(
            apiSettings,
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            {
                CustomCheckItemId: customCheckItemId,
                ChecklistId: checklistId,
            }
        );
    };

    const getNextCustomItemNumber = async (
        abortSignal: AbortSignal
    ): Promise<string> => {
        const data = await getByFetch(
            apiSettings,
            `CheckList/CustomItem/NextItemNo?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isNextAvailableNumber(data)) {
            throw TypeError('Invalid next available number from API.');
        }
        return data;
    };

    const putMetaTableStringCell = async (
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await putByFetch(
            apiSettings,
            `CheckList/Item/MetaTableCell?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            }
        );
    };

    const putMetaTableDateCell = async (
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await putByFetch(
            apiSettings,
            `CheckList/Item/MetaTableCellDate?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            }
        );
    };

    const putChecklistComment = async (Comment: string): Promise<void> => {
        await putByFetch(
            apiSettings,
            `CheckList/MC/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment }
        );
    };

    const postSign = async (): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/MC/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postUnsign = async (): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/MC/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postVerify = async (): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/MC/Verify?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postUnverify = async (): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/MC/Unverify?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postMultiSign = async (
        targetChecklistIds: number[],
        copyMetaTable: boolean
    ): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/MC/MultiSign?plantId=PCS$${plantId}${apiVersion}`,
            {
                OriginalCheckListId: checklistId,
                TargetCheckListIds: targetChecklistIds,
                CopyMetaTable: copyMetaTable,
            }
        );
    };

    const postMultiVerify = async (
        targetChecklistIds: number[]
    ): Promise<void> => {
        await postByFetch(
            apiSettings,
            `CheckList/MC/MultiVerify?plantId=PCS$${plantId}${apiVersion}`,
            {
                OriginalCheckListId: checklistId,
                TargetCheckListIds: targetChecklistIds,
            }
        );
    };

    const getCanMultiSign = async (
        abortSignal: AbortSignal
    ): Promise<ItemToMultiSignOrVerify[]> => {
        const data = await getByFetch(
            apiSettings,
            `CheckList/MC/CanMultiSign?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfItemToMultiSignOrVerify(data)) {
            throw new TypeError(
                'Error: Api responded with an unexpected type(ItemsToMultiSignOrVerify)'
            );
        }
        return data;
    };

    const getCanMultiVerify = async (
        abortSignal: AbortSignal
    ): Promise<ItemToMultiSignOrVerify[]> => {
        const data = await getByFetch(
            apiSettings,
            `CheckList/MC/CanMultiVerify?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfItemToMultiSignOrVerify(data)) {
            throw new TypeError(
                'Error: Api responded with an unexpected type(ItemsToMultiSignOrVerify)'
            );
        }
        return data;
    };

    const getChecklistAttachments = async (
        abortSignal: AbortSignal
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            apiSettings,
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=128${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfAttachments(data)) {
            throw new TypeError(
                'Error: Api responded with an unexpected type(Attachments)'
            );
        }
        return data;
    };

    const getChecklistAttachment = async (
        abortSignal: AbortSignal,
        attachmentId: number
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            apiSettings,
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,

            abortSignal
        );
        return data as Blob;
    };

    const deleteChecklistAttachment = async (
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await deleteByFetch(
            apiSettings,
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            dto
        );
    };

    const postChecklistAttachment = async (
        data: FormData,
        title?: string
    ): Promise<void> => {
        await postAttachmentByFetch(
            apiSettings,
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&title=${title}${apiVersion}`,
            data,
            false
        );
    };

    return {
        getPermissions,
        postVerify,
        postUnverify,
        postMultiSign,
        postMultiVerify,
        getCanMultiSign,
        getCanMultiVerify,
        postCustomCheckItem,
        postCustomClear,
        postCustomSetOk,
        getNextCustomItemNumber,
        deleteCustomCheckItem,
        deleteChecklistAttachment,
        getChecklistAttachments,
        getChecklistAttachment,
        getChecklist,
        postClear,
        postSetOk,
        postSetNA,
        postSign,
        postUnsign,
        postChecklistAttachment,
        putChecklistComment,
        putMetaTableStringCell,
        putMetaTableDateCell,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
