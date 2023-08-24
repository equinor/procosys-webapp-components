import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import {
    getCompletionStatusByCategory,
    getPunchOrganizationById,
    getPunchPriorityById,
    getPunchSortingById,
    getPunchTypeById,
    updatePunchlists,
} from './utils';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { PunchItem } from '../../typings/apiTypes';

const offlineContentRepository = new OfflineContentRepository();
const offlineUpdateRepository = new OfflineUpdateRepository();

type PunchDto = {
    PunchItemId: number;
    CategoryId?: number;
    Description?: string;
    RaisedByOrganizationId?: number;
    ClearingByOrganizationId?: number;
    PersonId?: number;
    DueDate?: string;
    TypeId?: number;
    SortingId?: number;
    PriorityId?: number;
    Estimate?: number;
};

/**
 * Update offline content database based on a post of new punch.
 */
export const handleUpdatePunch = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const updatedPunchDto: PunchDto = offlinePostRequest.bodyData;

    //Get offline punch
    const punchEntity = await offlineContentRepository.getEntityByTypeAndId(
        EntityType.PunchItem,
        updatedPunchDto.PunchItemId
    );
    const punch: PunchItem = punchEntity.responseObj;

    //Update modified punch data
    if (updatedPunchDto.Description) {
        punch.description = updatedPunchDto.Description;
    }

    if (updatedPunchDto.CategoryId) {
        const status = await getCompletionStatusByCategory(
            updatedPunchDto.CategoryId
        );
        if (status) {
            punch.status = status;
        }
    }
    if (updatedPunchDto.ClearingByOrganizationId) {
        const organization = await getPunchOrganizationById(
            updatedPunchDto.ClearingByOrganizationId
        );
        if (organization) {
            punch.clearingByCode = organization.code;
            punch.clearingByDescription = organization.description;
        }
    }
    if (updatedPunchDto.DueDate) {
        punch.dueDate = updatedPunchDto.DueDate;
    }
    if (updatedPunchDto.Estimate) {
        punch.estimate = updatedPunchDto.Estimate;
    }
    //todo hvilken person er dette?
    if (updatedPunchDto.PersonId) {
        //  punch. = updatedPunchDto.PersonId;
    }
    if (updatedPunchDto.PriorityId) {
        const priority = await getPunchPriorityById(updatedPunchDto.PriorityId);
        if (priority) {
            punch.priorityId = priority.id;
            punch.priorityCode = priority.code;
            punch.priorityDescription = priority.description;
        }
    }

    if (updatedPunchDto.RaisedByOrganizationId) {
        const organization = await getPunchOrganizationById(
            updatedPunchDto.RaisedByOrganizationId
        );
        if (organization) {
            punch.raisedByCode = organization.code;
            punch.raisedByDescription = organization.description;
        }
    }
    if (updatedPunchDto.SortingId) {
        const sorting = await getPunchSortingById(updatedPunchDto.SortingId);
        if (sorting) {
            punch.sorting = sorting.description; //todo: skal det være descriptiokn?
        }
    }
    if (updatedPunchDto.TypeId) {
        const type = await getPunchTypeById(updatedPunchDto.TypeId);
        if (type) {
            punch.typeCode = type.code;
            punch.typeDescription = type.description;
        }
    }

    //Update databases
    await offlineContentRepository.replaceEntity(punchEntity);

    await updatePunchlists(punch);

    await offlineUpdateRepository.addUpdateRequest(
        updatedPunchDto.PunchItemId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};
