import { PunchPreview } from '../../services/apiTypes';
import {
    filterOnFormType,
    filterOnResponsible,
    filterOnStatus,
    filterPunchPreviewsOnSignature,
} from './helperFunctions';
import { Filter } from './useFilterFacade';

export const filterPunchPreviews = (
    punchPreviews: PunchPreview[],
    filter: Filter
): { filteredPunchPreviews: PunchPreview[]; filterCount: number } => {
    let filteredPunchPreviews = punchPreviews;
    let filterCount = 0;
    if (filter.status.length > 0) {
        filteredPunchPreviews = filterOnStatus(
            filteredPunchPreviews,
            filter.status
        );
        filterCount++;
    }
    if (filter.signature) {
        filteredPunchPreviews = filterPunchPreviewsOnSignature(
            filteredPunchPreviews,
            filter.signature
        );
        filterCount++;
    }
    if (filter.responsible) {
        filteredPunchPreviews = filterOnResponsible(
            filteredPunchPreviews,
            filter.responsible
        );
        filterCount++;
    }
    if (filter.formType) {
        filteredPunchPreviews = filterOnFormType(
            filteredPunchPreviews,
            filter.formType
        );
        filterCount++;
    }
    return { filteredPunchPreviews, filterCount };
};
