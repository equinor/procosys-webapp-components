import { ChecklistPreview } from '../../../services/apiTypes';
import {
    filterChecklistPreviewsOnSignature,
    filterOnFormType,
    filterOnResponsible,
    filterOnStatus,
} from '../helperFunctions';
import { Filter } from '../useFilter';

export const filterChecklistPreviews = (
    checklistPreviews: ChecklistPreview[],
    filter: Filter
): { filteredChecklistPreviews: ChecklistPreview[]; filterCount: number } => {
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
        filteredChecklistPreviews = filterChecklistPreviewsOnSignature(
            filteredChecklistPreviews,
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
