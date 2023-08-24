import { Attachment, PunchItem, PunchPreview } from '../../typings/apiTypes';
import { EntityType } from '../../typings/enums';
import { IEntity } from '../../typings/helperTypes';
import { isArrayOfType, isOfType } from '../../utils/typeguard';
import { OfflineContentRepository } from '../OfflineContentRepository';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { generateRandomId } from './utils';

const offlineUpdateRepository = new OfflineUpdateRepository();
const offlineContentRepository = new OfflineContentRepository();

const addAttachmentToAttachmentList = async (
    attachmentListEntity: IEntity,
    newAttachmentId: number,
    title: string | null,
    mimeType?: string
): Promise<void> => {
    if (!isOfType<IEntity>(attachmentListEntity, 'responseObj')) {
        console.error(
            'Was not able to find checklist attachment list in offline database.',
            newAttachmentId
        );
        return;
        //todo: error handling
    }
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

    if (!isArrayOfType<Attachment>(attachmentList, 'title')) {
        console.error(
            'Response object was not array of Attachment.',
            attachmentListEntity
        );
    }

    const attachment: Attachment = {
        id: newAttachmentId,
        uri: '',
        title: title ? title : '',
        createdAt: new Date(),
        classification: '',
        mimeType: mimeType ?? '',
        thumbnailAsBase64: '',
        hasFile: true,
        fileName: title ? title : '',
    };
    attachmentList.push(attachment);
    await offlineContentRepository.replaceEntity(attachmentListEntity);
};

/**
 * Update offline content database based on a post of new punch attachment.
 */
export const handlePostPunchAttachment = async (
    offlinePostRequest: OfflineUpdateRequest,
    params: URLSearchParams
): Promise<void> => {
    const plantId = params.get('plantId');
    const title = params.get('title');
    const punchIdStr = params.get('punchItemId');
    const arrayBuffer = offlinePostRequest.blob;

    if (punchIdStr === null) {
        console.error('The request parameters does not contain a punchId.');
        return;
        //todo: Hva gjør vi her?
    }

    const punchId = Number(punchIdStr);

    //Construct url for new punch attachment
    const newAttachmentId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `PunchListItem/Attachment?plantId=${plantId}&punchItemId=${punchId}&attachmentId=${newAttachmentId}&${apiVersion}`;

    //Create entity object and store in database
    const punchAttachmentEntity: IEntity = {
        entitytype: EntityType.PunchAttachment,
        entityid: newAttachmentId,
        parententityid: punchId,
        responseObj: arrayBuffer,
        apipath: apiPath,
    };

    await offlineContentRepository.add(punchAttachmentEntity);

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.PunchAttachments,
            punchId
        );

    await addAttachmentToAttachmentList(
        attachmentListEntity,
        newAttachmentId,
        title,
        offlinePostRequest.mimeType
    );

    //Update attachment count on punch
    const punchEntity = await offlineContentRepository.getEntityByTypeAndId(
        EntityType.PunchItem,
        punchId
    );
    const punch: PunchItem = punchEntity.responseObj;
    punch.attachmentCount++;
    await offlineContentRepository.replaceEntity(punchEntity);

    //Update attachment count on checklist punchlist
    const checklistPunchlistEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistPunchlist,
            punch.checklistId
        );

    const checklistPunchlist: PunchPreview[] =
        checklistPunchlistEntity.responseObj;

    const punchPreview = checklistPunchlist.find(
        (punch) => punch.id === punchId
    );
    if (!isOfType<PunchPreview>(punchPreview, 'attachmentCount')) {
        console.error('Not able to find punch preview.');
        return;
    }
    punchPreview.attachmentCount++;
    await offlineContentRepository.replaceEntity(checklistPunchlistEntity);

    //Update count on main punchlist
    const punchlistEntity = await offlineContentRepository.getEntityByTypeAndId(
        EntityType.Punchlist,
        Number(checklistPunchlistEntity.parententityid)
    );
    if (!punchlistEntity) {
        console.error(
            'Was not able to find punchlist for entity in offline database.',
            attachmentListEntity.parententityid
        );
        return;
    }
    const punchlist: PunchPreview[] = punchlistEntity.responseObj;

    const punchlistPunchPreview = punchlist.find(
        (punch) => punch.id === punchId
    );
    if (!isOfType<PunchPreview>(punchlistPunchPreview, 'attachmentCount')) {
        console.error('Not able to find punch preview in punchlist.');
        return;
    }
    punchlistPunchPreview.attachmentCount++;
    await offlineContentRepository.replaceEntity(punchlistEntity);
    await offlineUpdateRepository.addUpdateRequest(
        punchId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};

/**
 * Update offline content database based on a post of new work order attachment.
 */
export const handlePostWorkOrderAttachment = async (
    offlinePostRequest: OfflineUpdateRequest,
    params: URLSearchParams
): Promise<void> => {
    const plantId = params.get('plantId');
    const title = params.get('title');
    const workOrderId = params.get('workOrderId');
    const arrayBuffer = offlinePostRequest.blob;

    //Construct url for new punch attachment
    const newAttachmentId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `WorkOrder/Attachment?plantId=${plantId}&workOrderId=${workOrderId}&attachmentId=${newAttachmentId}&${apiVersion}`;

    //Create entity object and store in database
    const workOrderAttachmentEntity: IEntity = {
        entitytype: EntityType.WorkOrderAttachment,
        entityid: newAttachmentId,
        parententityid: workOrderId ? Number(workOrderId) : undefined,
        responseObj: arrayBuffer,
        apipath: apiPath,
    };

    await offlineContentRepository.add(workOrderAttachmentEntity);

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.WorkOrderAttachments,
            Number(workOrderId)
        );
    await addAttachmentToAttachmentList(
        attachmentListEntity,
        newAttachmentId,
        title
    );
    await offlineUpdateRepository.addUpdateRequest(
        Number(workOrderId),
        EntityType.WorkOrder,
        offlinePostRequest
    );

    //todo: Må oppdatere punch listen også, med attachmentCount
};

/**
 * Update offline content database based on a post of new checklist attachment.
 */
export const handlePostChecklistAttachment = async (
    offlinePostRequest: OfflineUpdateRequest,
    params: URLSearchParams
): Promise<void> => {
    const plantId = params.get('plantId');
    const title = params.get('title');
    const checklistId = params.get('checkListId');
    const arrayBuffer = offlinePostRequest.blob;

    //Construct url for new punch attachment
    const newAttachmentId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `CheckList/Attachment?plantId=${plantId}&checkListId=${checklistId}&attachmentId=${newAttachmentId}&${apiVersion}`;

    //Create entity object and store in database
    const checklistAttachmentEntity: IEntity = {
        entitytype: EntityType.ChecklistAttachment,
        entityid: newAttachmentId,
        parententityid: checklistId ? Number(checklistId) : undefined,
        responseObj: arrayBuffer,
        apipath: apiPath,
    };

    await offlineContentRepository.add(checklistAttachmentEntity);

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistAttachments,
            Number(checklistId)
        );
    await addAttachmentToAttachmentList(
        attachmentListEntity,
        newAttachmentId,
        title,
        offlinePostRequest.mimeType
    );
    await offlineUpdateRepository.addUpdateRequest(
        Number(checklistId),
        EntityType.Checklist,
        offlinePostRequest
    );
    //todo: Må oppdatere punch listen også, med attachmentCount
};

/**
 * Deletes an attachment from an attatchment list and updates the response in the offline database
 */
const deleteAttachmentFromList = async (
    attachmentListEntity: IEntity,
    attachmentId: number
): Promise<void> => {
    if (!isOfType<IEntity>(attachmentListEntity, 'responseObj')) {
        console.error(
            'Was not able to find checklist attachment list in offline database.',
            attachmentId
        );
        //todo: Må sørge for at bruker for feilmelding.
        return;
    }
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

    if (!isArrayOfType<Attachment>(attachmentList, 'title')) {
        console.error(
            'Response object was not array of Attachment.',
            attachmentListEntity
        );
    }

    const indexOfAttachment = attachmentList.findIndex(
        (attachment) => attachment.id === attachmentId
    );

    if (indexOfAttachment > -1) {
        attachmentList.splice(indexOfAttachment, 1);

        await offlineContentRepository.replaceEntity(attachmentListEntity);
    } else {
        console.error(
            'Did not find the attachment in the checklist attachment list.',
            attachmentListEntity,
            attachmentId
        );
        //todo: Må sørge for at bruker for feilmelding.
    }
};

type DeleteWOAttachmentDto = {
    workOrderId: number;
    AttachmentId: number;
};

/**
 * Update offline content database based on delete of work order attachment.
 */
export const handleDeleteWorkOrderAttachment = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: DeleteWOAttachmentDto = offlinePostRequest.bodyData;

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.WorkOrderAttachments,
            Number(dto.workOrderId)
        );

    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
    await offlineUpdateRepository.addUpdateRequest(
        dto.workOrderId,
        EntityType.WorkOrder,
        offlinePostRequest
    );
};

type DeletePunchAttachmentDto = {
    PunchItemId: number;
    AttachmentId: number;
};

/**
 * Update offline content database based on a delete of punch attachment.
 */
export const handleDeletePunchAttachment = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: DeletePunchAttachmentDto = offlinePostRequest.bodyData;

    //Update attachment list on punch
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.PunchAttachments,
            Number(dto.PunchItemId)
        );
    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
    await offlineUpdateRepository.addUpdateRequest(
        dto.PunchItemId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};

type DeleteChecklistAttachmentDto = {
    CheckListId: number;
    AttachmentId: number;
};

export const handleDeleteCheckListAttachment = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: DeleteChecklistAttachmentDto = offlinePostRequest.bodyData;

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistAttachments,
            Number(dto.CheckListId)
        );

    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
    await offlineUpdateRepository.addUpdateRequest(
        dto.CheckListId,
        EntityType.Checklist,
        offlinePostRequest
    );
};
