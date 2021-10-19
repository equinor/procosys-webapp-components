import { ChecklistPreview } from '../../../services/apiTypes';
import {
    filterOnFormType,
    filterOnResponsible,
    filterOnSignature,
    filterOnStatus,
} from '../helperFunctions';
import { Filter } from '../useFilter';

type FilterChecklistPreviewsReturnType = {
    filteredChecklistPreviews: ChecklistPreview[];
    filterCount: number;
};

export const filterChecklistPreviews = (
    checklistPreviews: ChecklistPreview[],
    filter: Filter
): FilterChecklistPreviewsReturnType => {
    let filteredChecklistPreviews = checklistPreviews;
    let filterCount = 0;
    if (filter.status.length > 0) {
        filteredChecklistPreviews = filterOnStatus(
            filteredChecklistPreviews,
            filter.status
        );
        filterCount++;
    }
    if (filter.signature) {
        filteredChecklistPreviews = filterOnSignature(
            filteredChecklistPreviews,
            'isSigned',
            'isVerified',
            filter.signature
        );
        filterCount++;
    }
    if (filter.responsible) {
        filteredChecklistPreviews = filterOnResponsible(
            filteredChecklistPreviews,
            filter.responsible
        );
        filterCount++;
    }
    if (filter.formType) {
        filteredChecklistPreviews = filterOnFormType(
            filteredChecklistPreviews,
            filter.formType
        );
        filterCount++;
    }
    return { filteredChecklistPreviews, filterCount };
};
