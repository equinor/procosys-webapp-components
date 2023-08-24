import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType, PunchAction } from '../../typings/enums';
import { getStringBetween, updatePunchlists } from './utils';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { PunchItem } from '../../typings/apiTypes';

const offlineContentRepository = new OfflineContentRepository();
const offlineUpdateRepository = new OfflineUpdateRepository();

/**
 * Update offline content database based on a post of punch action.
 */
export const handlePunchAction = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const punchItemId = offlinePostRequest.bodyData;

    const punchAction = getStringBetween(
        offlinePostRequest.url,
        'PunchListItem/',
        '?'
    );

    const punchItemEntity = await offlineContentRepository.getEntityByTypeAndId(
        EntityType.PunchItem,
        Number(punchItemId)
    );

    const punch: PunchItem = punchItemEntity.responseObj;

    //Update offline punch item
    if (punch) {
        switch (punchAction) {
            case PunchAction.CLEAR:
                punch.clearedAt = '<updated when online>';
                punch.clearedByFirstName = '<offline user>';
                punch.clearedByLastName = '<offline user>';
                break;
            case PunchAction.UNCLEAR:
                punch.clearedAt = null;
                punch.clearedByFirstName = null;
                punch.clearedByLastName = null;
                break;
            case PunchAction.VERIFY:
                punch.verifiedAt = '<updated when online>';
                punch.verifiedByFirstName = '<offline user>';
                punch.verifiedByLastName = '<offline user>';
                break;
            case PunchAction.UNVERIFY:
                punch.verifiedAt = null;
                punch.verifiedByFirstName = null;
                punch.verifiedByLastName = null;
                break;
            case PunchAction.REJECT:
                punch.rejectedAt = '<updated when online>';
                punch.rejectedByFirstName = '<offline user>';
                punch.rejectedByLastName = '<offline user>';
        }
    }
    punchItemEntity.responseObj = punch;
    await offlineContentRepository.replaceEntity(punchItemEntity);

    await updatePunchlists(punch);

    await offlineUpdateRepository.addUpdateRequest(
        punchItemId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};
