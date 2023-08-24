import {
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
    PunchItem,
    PunchPreview,
} from '../../typings/apiTypes';
import { CompletionStatus, EntityType } from '../../typings/enums';
import { Entity } from '../Entity';
import { OfflineContentRepository } from '../OfflineContentRepository';

const offlineContentRepository = new OfflineContentRepository();

/**
 * Find the completion status code based on punch category id
 */
export const getCompletionStatusByCategory = async (
    categoryId: number
): Promise<CompletionStatus> => {
    const entity = await offlineContentRepository.getEntityByType(
        EntityType.PunchCategories
    );
    const categories: PunchCategory[] = entity.responseObj;
    const category = categories.find((category) => category.id == categoryId);
    return category ? (category.code as CompletionStatus) : CompletionStatus.PA;
};

/**
 * Find the organization code based on punch organization id
 */
export const getPunchOrganizationById = async (
    organizationId: number
): Promise<PunchOrganization | null> => {
    const entity = await offlineContentRepository.getEntityByType(
        EntityType.PunchOrganization
    );
    const organizations: PunchOrganization[] = entity.responseObj;
    const organization = organizations.find(
        (organization) => organization.id == organizationId
    );
    if (organization) {
        return organization;
    }
    console.error(
        `The punch organization with id ${organizationId} was not found in offline database.`
    );
    return null;
};

/**
 * Find the punch priority object based on punch priority id
 */
export const getPunchPriorityById = async (
    priorityId: number
): Promise<PunchPriority | null> => {
    const entity = await offlineContentRepository.getEntityByType(
        EntityType.PunchPriorities
    );
    const priorities: PunchPriority[] = entity.responseObj;
    const priority = priorities.find((priority) => priority.id == priorityId);

    if (priority) {
        return priority;
    }
    console.error(
        `The punch priority with id ${priorityId} was not found in offline database.`
    );
    return null;
};

/**
 * Find the punch sorting object based on punch sorting id
 */
export const getPunchSortingById = async (
    sortingId: number
): Promise<PunchSort | null> => {
    const entity = await offlineContentRepository.getEntityByType(
        EntityType.PunchSorts
    );
    const sortings: PunchSort[] = entity.responseObj;
    const sorting = sortings.find((sorting) => sorting.id == sortingId);

    if (sorting) {
        return sorting;
    }
    console.error(
        `The punch sorting with id ${sortingId} was not found in offline database.`
    );
    return null;
};

/**
 * Find the punch type object based on punch type id
 */
export const getPunchTypeById = async (
    typeId: number
): Promise<PunchType | null> => {
    const entity = await offlineContentRepository.getEntityByType(
        EntityType.PunchTypes
    );

    const types: PunchType[] = entity.responseObj;
    const type = types.find((type) => type.id == typeId);

    if (type) {
        return type;
    }
    console.error(
        `The punch type with id ${typeId} was not found in offline database.`
    );
    return null;
};

/**
 * We will get a floating number between 0 and 1. This should ensure that we don't get an id already in use.
 */
export const generateRandomId = (): number => {
    return -Math.floor(Math.random() * 10000000);
};

/**
 * Update all fields in targetObj with fields from sourceObj
 */
export const updateObject = (sourceObj: any, targetObj: any): any => {
    return null;
};

/**
 * Return the the string between, based on pre- and post string
 */
export const getStringBetween = (
    str: string,
    startStr: string,
    endStr: string
): string | null => {
    const pos = str.indexOf(startStr) + startStr.length;
    return str.substring(pos, str.indexOf(endStr, pos));
};

/**
 * Update punchlist and checklist punchlist
 */
export const updatePunchlists = async (punch: PunchItem): Promise<void> => {
    const update = async (punchlistEntity: Entity): Promise<void> => {
        //Get punch review from list
        const punchlist: PunchPreview[] = punchlistEntity.responseObj;
        const storedPunchIndex = punchlist.findIndex((p) => p.id == punch.id);

        //Update punch review
        if (storedPunchIndex > -1) {
            const storedPunch = punchlist[storedPunchIndex];
            storedPunch.cleared = punch.clearedAt != null;
            storedPunch.verified = punch.verifiedAt != null;
            storedPunch.rejected = punch.rejectedAt != null;
            storedPunch.attachmentCount = punch.attachmentCount;
            storedPunch.description = punch.description;
            storedPunch.formularType = punch.formularType;
            storedPunch.status = punch.status;

            //Replace updated object in database
            await offlineContentRepository.replaceEntity(punchlistEntity);
        }
    };

    const checklistPunchlistEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistPunchlist,
            punch.checklistId
        );
    const mainEntityId = checklistPunchlistEntity.parententityid; //MC,Tag,PO or WO

    if (mainEntityId === undefined) {
        console.error(
            'Not able to find main punch list based on checklist punchlist entity.',
            checklistPunchlistEntity
        );
        return;
    }

    const punchlistEntity = await offlineContentRepository.getEntityByTypeAndId(
        EntityType.Punchlist,
        mainEntityId
    );

    await update(checklistPunchlistEntity);
    await update(punchlistEntity);
};
