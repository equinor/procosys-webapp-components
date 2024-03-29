import {
    Attachment,
    CheckItem,
    ChecklistDetails,
    ChecklistResponse,
    CustomCheckItem,
    ItemToMultiSignOrVerify,
    LoopTag,
} from '../typings/apiTypes';

const isAttachment = (data: unknown): data is Attachment => {
    return data != null && typeof (data as Attachment).hasFile === 'boolean';
};

export const isArrayOfAttachments = (data: unknown): data is Attachment[] => {
    if (!Array.isArray(data)) return false;
    if (data.length == 0) return true;
    return Array.isArray(data) && data.every(isAttachment);
};

//CHECKLIST
export const isNextAvailableNumber = (data: unknown): data is string => {
    return typeof data === 'string';
};

export const isArrayOfItemToMultiSignOrVerify = (
    data: unknown
): data is ItemToMultiSignOrVerify[] => {
    return Array.isArray(data) && data.every(isItemToMultiSignOrVerify);
};

const isItemToMultiSignOrVerify = (
    data: unknown
): data is ItemToMultiSignOrVerify => {
    return (
        data != null &&
        typeof (data as ItemToMultiSignOrVerify).tagNo === 'string'
    );
};

const isLoopTag = (data: unknown): data is LoopTag => {
    return data != null && typeof (data as LoopTag).tagId === 'number';
};

const isArrayOfLoopTags = (data: unknown): data is LoopTag[] => {
    return Array.isArray(data) && data.every(isLoopTag);
};

const isChecklistDetails = (data: unknown): data is ChecklistDetails => {
    return (
        data != null &&
        typeof (data as ChecklistDetails).hasElectronicForm === 'boolean'
    );
};

const isCheckItem = (data: unknown): data is CheckItem => {
    return (
        data != null && typeof (data as CheckItem).hasMetaTable === 'boolean'
    );
};

const isArrayOfCheckItems = (data: unknown): data is CheckItem[] => {
    return Array.isArray(data) && data.every(isCheckItem);
};

const isCustomCheckItem = (data: unknown): data is CustomCheckItem => {
    return data != null && typeof (data as CustomCheckItem).isOk === 'boolean';
};

const isArrayOfCustomCheckItems = (
    data: unknown
): data is CustomCheckItem[] => {
    return Array.isArray(data) && data.every(isCustomCheckItem);
};

export const isChecklistResponse = (
    data: unknown
): data is ChecklistResponse => {
    return (
        data != null &&
        isArrayOfLoopTags((data as ChecklistResponse).loopTags) &&
        isChecklistDetails((data as ChecklistResponse).checkList) &&
        isArrayOfCheckItems((data as ChecklistResponse).checkItems) &&
        isArrayOfCustomCheckItems((data as ChecklistResponse).customCheckItems)
    );
};
