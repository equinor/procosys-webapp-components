import {
    ChecklistPreview,
    CompletionStatus,
    PunchPreview,
} from '../../services/apiTypes';
import { Signatures } from './useFilterFacade';

export const filterOnStatus = <T extends { status: CompletionStatus }>(
    arrayToFilter: T[],
    statuses: string[]
): T[] => {
    return arrayToFilter.filter((item) => {
        return statuses.indexOf(item.status) != -1;
    });
};

export const filterPunchPreviewsOnSignature = (
    arrayToFilter: PunchPreview[],
    signature: string
): PunchPreview[] => {
    if (signature === Signatures.NOT_CLEARED) {
        return arrayToFilter.filter((item) => {
            return !item.cleared;
        });
    } else {
        return arrayToFilter.filter((item) => {
            return item.cleared && !item.verified;
        });
    }
};

export const filterChecklistPreviewsOnSignature = (
    arrayToFilter: ChecklistPreview[],
    signature: string
): ChecklistPreview[] => {
    if (signature === Signatures.NOT_SIGNED) {
        return arrayToFilter.filter((item) => {
            return !item.isSigned;
        });
    } else {
        return arrayToFilter.filter((item) => {
            return item.isSigned && !item.isVerified;
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
