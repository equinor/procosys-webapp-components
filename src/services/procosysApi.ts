import { AxiosInstance, CancelToken } from 'axios';
import { CustomCheckItemDto } from '../checklist/CheckItems/CustomCheckItems';
import { ChecklistResponse, Attachment } from './apiTypes';

type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
    plantId: string;
    checklistId: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = ({
    axios,
    apiVersion = '&api-version=4.1',
    plantId,
    checklistId,
}: ProcosysApiServiceProps) => {
    const getChecklist = async (): Promise<ChecklistResponse> => {
        const { data } = await axios.get(
            `Checklist/MC?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`
        );
        return data as ChecklistResponse;
    };

    const postSetOk = async (checkItemId: number): Promise<void> => {
        await axios.post(
            `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postSetNA = async (checkItemId: number): Promise<void> => {
        await axios.post(
            `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postClear = async (checkItemId: number): Promise<void> => {
        await axios.post(
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
        await axios.post(
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
        await axios.post(
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
        const { data } = await axios.post(
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            { ...dto, ChecklistId: checklistId }
        );
        console.log('data ', data);
        return data.id;
    };

    const deleteCustomCheckItem = async (customCheckItemId: number) => {
        await axios.delete(
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            {
                data: {
                    CustomCheckItemId: customCheckItemId,
                    ChecklistId: checklistId,
                },
            }
        );
    };

    const getNextCustomItemNumber = async (): Promise<string> => {
        const { data } = await axios.get(
            `CheckList/CustomItem/NextItemNo?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`
        );
        return data;
    };

    const putMetaTableCell = async (
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await axios.put(
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

    const putChecklistComment = async (Comment: string): Promise<void> => {
        await axios.put(
            `CheckList/MC/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment }
        );
    };

    const postSign = async (): Promise<void> => {
        await axios.post(
            `CheckList/MC/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const postUnsign = async (): Promise<void> => {
        await axios.post(
            `CheckList/MC/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const getChecklistAttachments = async (): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=128${apiVersion}`
        );
        return data as Attachment[];
    };

    const getChecklistAttachment = async (
        cancelToken: CancelToken,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                cancelToken: cancelToken,
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
        );
        return data as Blob;
    };

    const deleteChecklistAttachment = async (
        cancelToken: CancelToken,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            { data: dto, cancelToken: cancelToken }
        );
    };

    const postChecklistAttachment = async (
        data: FormData,
        title?: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&title=${title}${apiVersion}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    return {
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
        putMetaTableCell,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
