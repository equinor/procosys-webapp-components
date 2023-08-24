import { EntityType } from '../typings/enums';
import { db } from './db';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

class OfflineUpdateRepository {
    /**
     * Get all update requests
     */
    async getUpdateRequests(): Promise<OfflineUpdateRequest[]> {
        const result = await db.offlineUpdates.toArray();
        db.offlineUpdates.orderBy(['seqno']);
        return result as OfflineUpdateRequest[];
    }

    /**
     * Get all update requests
     */
    async getUpdateRequest(uniqueId: string): Promise<OfflineUpdateRequest> {
        const update = await db.offlineUpdates
            .where('uniqueId')
            .equals(uniqueId)
            .first();
        if (update) {
            return update as OfflineUpdateRequest;
        } else {
            throw Error(
                'Offline update with uniqueId ' + uniqueId + ' was not found.'
            );
        }
    }

    /**
     * Add new update request.
     * The entityId should be id for either checklist, punch or work order.
     * When the updates later are sent to main-api, they will be grouped by entityid.
     */
    async addUpdateRequest(
        entityId: number,
        entityType:
            | EntityType.Checklist
            | EntityType.PunchItem
            | EntityType.WorkOrder,
        offlineUpdateRequest: OfflineUpdateRequest
    ): Promise<void> {
        offlineUpdateRequest.entityId = Number(entityId);
        offlineUpdateRequest.entityType = entityType;

        if (db.offlineUpdates !== undefined) {
            await db.offlineUpdates.add(offlineUpdateRequest);
        } else {
            throw Error(
                'Offline database is not initialized. Not able to store updates.'
            );
        }
    }

    /**
     * Update the offline update request.
     */
    async updateOfflineUpdateRequest(
        offlineUpdateRequest: OfflineUpdateRequest
    ): Promise<void> {
        if (db.offlineUpdates !== undefined) {
            const oldOfflineUpdate = await db.offlineUpdates
                .where('uniqueId')
                .equals(offlineUpdateRequest.uniqueId)
                .first();

            if (!oldOfflineUpdate) {
                throw Error(
                    `The offline update request to update was not found. UniqueId=${offlineUpdateRequest.uniqueId}, url path=${offlineUpdateRequest.url}`
                );
            }

            await db.offlineUpdates.put(offlineUpdateRequest);
        } else {
            throw Error(
                `Entity ${offlineUpdateRequest.entityId} - ${offlineUpdateRequest.description}  not updated in database. Offline content database not available.`
            );
        }
    }
}
export { OfflineUpdateRepository };
