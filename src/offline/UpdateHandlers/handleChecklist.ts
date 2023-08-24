import {
    ChecklistResponse,
    ChecklistPreview,
    PunchPreview,
} from '../../typings/apiTypes';
import { EntityType, CompletionStatus, SearchType } from '../../typings/enums';
import { IEntity } from '../../typings/helperTypes';
import { OfflineContentRepository } from '../OfflineContentRepository';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { generateRandomId } from './utils';

const offlineContentRepository = new OfflineContentRepository();
const offlineUpdateRepository = new OfflineUpdateRepository();

/**
 * Update offline content database based on a post of checklist sign
 */
export const handleChecklistPostSign = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const checklistId: number = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            checklistId
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (
        checklist &&
        checklistEntity.parententityid &&
        checklistEntity.searchtype
    ) {
        checklist.checkList.signedAt = new Date();
        checklist.checkList.signedByFirstName = '<offline user>';
        checklist.checkList.signedByLastName = '<offline user>';
        checklist.checkList.signedByUser = '<offline user>';
        await offlineContentRepository.replaceEntity(checklistEntity);

        await updateStatusInScopeList(
            checklistEntity.parententityid,
            checklist.checkList.id,
            checklistEntity.searchtype,
            true,
            false
        );

        await offlineUpdateRepository.addUpdateRequest(
            checklistId,
            EntityType.Checklist,
            offlinePostRequest
        );
    }
};

/**
 * Update offline content database based on a post of checklist unsign
 */
export const handleChecklistPostUnSign = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const checklistId: number = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );
    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.signedAt = null;
        checklist.checkList.signedByFirstName = null;
        checklist.checkList.signedByLastName = null;
        checklist.checkList.signedByUser = null;
        await offlineContentRepository.replaceEntity(checklistEntity);

        if (checklistEntity.parententityid && checklistEntity.searchtype) {
            await updateStatusInScopeList(
                checklistEntity.parententityid,
                checklist.checkList.id,
                checklistEntity.searchtype,
                false,
                false
            );
        }

        await offlineUpdateRepository.addUpdateRequest(
            checklistId,
            EntityType.Checklist,
            offlinePostRequest
        );
    }
};

/**
 * Update offline content database based on a post of checklist verify
 */
export const handleChecklistPostVerify = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const checklistId: number = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );
    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.verifiedAt = new Date();
        checklist.checkList.verifiedByFirstName = '<offline user>';
        checklist.checkList.verifiedByLastName = '<offline user>';
        checklist.checkList.verifiedByUser = '<offline user>';
        await offlineContentRepository.replaceEntity(checklistEntity);

        if (checklistEntity.parententityid && checklistEntity.searchtype) {
            await updateStatusInScopeList(
                checklistEntity.parententityid,
                checklist.checkList.id,
                checklistEntity.searchtype,
                true,
                true
            );
        }

        await offlineUpdateRepository.addUpdateRequest(
            checklistId,
            EntityType.Checklist,
            offlinePostRequest
        );
    }
};

/**
 * Update offline content database based on a post of checklist unverify
 */
export const handleChecklistPostUnVerify = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const checklistId: number = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.verifiedAt = null;
        checklist.checkList.verifiedByFirstName = null;
        checklist.checkList.verifiedByLastName = null;
        checklist.checkList.verifiedByUser = null;
        await offlineContentRepository.replaceEntity(checklistEntity);

        if (checklistEntity.parententityid && checklistEntity.searchtype) {
            await updateStatusInScopeList(
                checklistEntity.parententityid,
                checklist.checkList.id,
                checklistEntity.searchtype,
                true,
                false
            );
        }

        await offlineUpdateRepository.addUpdateRequest(
            checklistId,
            EntityType.Checklist,
            offlinePostRequest
        );
    }
};

type CustomCheckItemDto = {
    ItemNo: string;
    Text: string;
    IsOk: boolean;
    ChecklistId: string;
};

/**
 * Update offline content database based on a post of custom checkitem
 */
export const handleChecklistPostCustomCheckItem = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void | { id: number }> => {
    const dto: CustomCheckItemDto = await offlinePostRequest.bodyData;

    //Get checklist and add the new custom check item
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.ChecklistId)
        );

    const checklist: ChecklistResponse = await checklistEntity.responseObj;
    if (checklist) {
        const id = generateRandomId();
        const newCustomCheckItem = {
            id: id,
            itemNo: dto.ItemNo,
            text: dto.Text,
            isOk: dto.IsOk,
        };

        checklist.customCheckItems.push(newCustomCheckItem);
        await offlineContentRepository.replaceEntity(checklistEntity);

        offlinePostRequest.responseIsNewEntityId = true;
        offlinePostRequest.temporaryId = newCustomCheckItem.id;

        await offlineUpdateRepository.addUpdateRequest(
            Number(dto.ChecklistId),
            EntityType.Checklist,
            offlinePostRequest
        );

        return { id: id };
    }
};

type ChecklistCommentDto = {
    CheckListId: number;
    Comment: string;
};

/**
 * Update offline content database based on a put of checklist comment
 */
export const handleChecklistPutComment = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: ChecklistCommentDto = offlinePostRequest.bodyData;
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.comment = dto.Comment;
    }
    await offlineContentRepository.replaceEntity(checklistEntity);
    await offlineUpdateRepository.addUpdateRequest(
        dto.CheckListId,
        EntityType.Checklist,
        offlinePostRequest
    );
};

/**
 * Returnes an completion status (PA, PB or OK) for a checklist, by traversing the punches.
 * Return the most 'severe' status given on any of the given punches.
 */
const getPunchStatusForChecklist = async (
    checklist: ChecklistPreview
): Promise<CompletionStatus> => {
    const checklistPunchlistEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistPunchlist,
            checklist.id
        );

    const punchlist: PunchPreview[] = checklistPunchlistEntity.responseObj;

    const hasPA = punchlist.some(
        (punch) => punch.status == CompletionStatus.PA && !punch.cleared
    );
    if (hasPA) {
        return CompletionStatus.PA;
    }

    const hasPB = punchlist.some(
        (punch) => punch.status == CompletionStatus.PB && !punch.cleared
    );
    if (hasPB) {
        return CompletionStatus.PB;
    }
    return CompletionStatus.OK;
};

/**
 * Update status on a checklist on the scope list based on sign status and punch status.
 */
const updateStatusInScopeList = async (
    parentEntityId: number,
    checklistId: number,
    searchType: SearchType,
    isSigned: boolean,
    isVerified: boolean
): Promise<void> => {
    const checklistsEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklists,
            parentEntityId,
            searchType
        );

    const checklists: ChecklistPreview[] = checklistsEntity.responseObj;

    const checklistIndex = checklists.findIndex((c) => c.id == checklistId);
    if (checklistIndex > -1) {
        //Set checklist statuses
        checklists[checklistIndex].isSigned = isSigned;
        checklists[checklistIndex].isVerified = isVerified;

        if (!isSigned) {
            //TODO: Er dette korrekt
            checklists[checklistIndex].status = CompletionStatus.OS;
        } else {
            checklists[checklistIndex].status =
                await getPunchStatusForChecklist(checklists[checklistIndex]);
        }

        offlineContentRepository.replaceEntity(checklistsEntity);
    }
};
