import { Document, PunchPreview } from '../../../typings/apiTypes';
import { DocumentRelationType } from '../../../typings/enums';
import {
    filterOnFormType,
    filterOnResponsible,
    filterOnSignature,
    filterOnStatus,
    filterOnMcPkg,
    filterOnDocumentRelationType,
} from '../helperFunctions';
import { Filter } from '../useFilter';

export type DocumentFilterType = {
    documentRelationType: string[];
};

type FilterDocumentsReturnType = {
    filteredDocuments: Document[];
    filterCount: number;
};

export const filterDocuments = (
    documents: Document[],
    filter: DocumentFilterType
): FilterDocumentsReturnType => {
    let filteredDocuments = documents;
    let filterCount = 0;
    if (filter.documentRelationType.length > 0) {
        filteredDocuments = filterOnDocumentRelationType(
            filteredDocuments,
            filter.documentRelationType
        );
        filterCount++;
    }
    return { filteredDocuments, filterCount };
};
