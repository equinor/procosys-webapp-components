import { ChecklistResponse } from '../../typings/apiTypes';
import { EntityType } from '../../typings/enums';
import { IEntity } from '../../typings/helperTypes';
import { OfflineContentRepository } from '../OfflineContentRepository';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';

const offlineUpdateRepository = new OfflineUpdateRepository();
const offlineContentRepository = new OfflineContentRepository();

type Dto = {
    CheckListId: string;
    CheckItemId: number;
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostSetOK = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: Dto = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isOk = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }

    await offlineUpdateRepository.addUpdateRequest(
        Number.parseInt(dto.CheckListId),
        EntityType.Checklist,
        offlinePostRequest
    );
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostSetNA = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: Dto = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isNotApplicable = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
    await offlineUpdateRepository.addUpdateRequest(
        Number.parseInt(dto.CheckListId),
        EntityType.Checklist,
        offlinePostRequest
    );
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostClear = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: Dto = await offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isNotApplicable = false;
        checkitem.isOk = false;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }

    await offlineUpdateRepository.addUpdateRequest(
        Number.parseInt(dto.CheckListId),
        EntityType.Checklist,
        offlinePostRequest
    );
};

type ChecklistMetatableCell = {
    CheckListId: number;
    CheckItemId: number;
    ColumnId: number;
    RowId: number;
    Value: string;
};

/**
 * Update offline content database based on a put meta table cell
 */
export const handleChecklistPutMetaTableCell = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: ChecklistMetatableCell = offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        const checkitem = checklist.checkItems.find(
            (item) => item.id === dto.CheckItemId
        );
        if (checkitem && checkitem.metaTable) {
            const row = checkitem.metaTable.rows.find(
                (item) => item.id === dto.RowId
            );
            if (row && row.cells) {
                const cell = row.cells.find(
                    (item) => item.columnId === dto.ColumnId
                );
                if (cell) {
                    if (cell.isValueDate) {
                        cell.valueDate = dto.Value;
                    } else {
                        cell.value = dto.Value;
                    }
                    await offlineContentRepository.replaceEntity(
                        checklistEntity
                    );
                    await offlineUpdateRepository.addUpdateRequest(
                        dto.CheckListId,
                        EntityType.Checklist,
                        offlinePostRequest
                    );
                } else {
                    console.error(
                        'Was not able to find cell in metatable.',
                        dto,
                        checkitem.metaTable
                    );
                }
            } else {
                console.error(
                    'Was not able to find row in metatable, or row.cells.',
                    dto,
                    checkitem.metaTable
                );
            }
        } else {
            console.error(
                'Was not able to find checkitem or checkitem metaTable.',
                dto,
                checkitem?.metaTable
            );
        }
    } else {
        console.error('Was not able to find checklist.', dto.CheckListId);
    }
};
