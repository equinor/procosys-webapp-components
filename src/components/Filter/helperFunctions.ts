import { CompletionStatus, DocumentRelationType } from '../../typings/enums';
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

export const filterOnMcPkg = <T extends { mcPkgNo?: string }>(
    arrayToFilter: T[],
    mcPkg: string
): T[] => {
    return arrayToFilter.filter((item) => {
        return item.mcPkgNo === mcPkg;
    });
};

export const filterOnDocumentRelationType = <
    T extends { relationType: DocumentRelationType }
>(
    arrayToFilter: T[],
    relationTypes: string[]
): T[] => {
    return arrayToFilter.filter((item) => {
        return relationTypes.indexOf(item.relationType) != -1;
    });
};
