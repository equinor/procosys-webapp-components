import {
    ChecklistPreview,
    CompletionStatus,
    PunchPreview,
} from '../../services/apiTypes';
import { Signatures } from './useFilter';

export const filterOnStatus = <T extends { status: CompletionStatus }>(
    arrayToFilter: T[],
    statuses: string[]
): T[] => {
    return arrayToFilter.filter((item) => {
        return statuses.indexOf(item.status) != -1;
    });
};

export const filterOnSignature = <T, K extends keyof T>(
    arrayToFilter: T[],
    key: K,
    verified: K,
    signature: string
): T[] => {
    if (
        signature === Signatures.NOT_SIGNED ||
        signature === Signatures.NOT_CLEARED
    ) {
        return arrayToFilter.filter((item) => {
            return !item[key];
        });
    } else {
        return arrayToFilter.filter((item) => {
            return item[key] && !item[verified];
        });
    }
};

export const filterOnResponsible = <T extends { responsibleCode: string }>(
    arrayToFilter: T[],
    responsible: string
): T[] => {
    return arrayToFilter.filter((item) => {
        return item.responsibleCode === responsible;
    });
};

export const filterOnFormType = <T extends { formularType: string }>(
    arrayToFilter: T[],
    formType: string
): T[] => {
    return arrayToFilter.filter((item) => {
        return item.formularType === formType;
    });
};
