import { EntityType, SearchType } from '../typings/enums';
import { Entity, EntityIndexes } from './Entity';
import db from './db';

class OfflineContentRepository {
    async getById(id: number): Promise<Entity> {
        console.log('get by id', id);
        const result = await db.offlineContent.where('id').equals(id).first();
        return result as Entity;
    }

    /**
     * Return entity by api path. Null is returned, if not found.
     */
    async getByApiPath(apiPath: string): Promise<Entity | null> {
        console.log('get by api path: ', apiPath);

        const result = await db.offlineContent
            .where('apipath')
            .equals(apiPath)
            .first();

        if (result) {
            return result as Entity;
        } else {
            return null;
        }
    }

    /**
     * Return entity ids for all entities of a specific type. If no entities are found, an empty array is returned.
     */
    async getEntityIdsByType(entityType: EntityType): Promise<number[]> {
        console.log('get entity id by type: ', entityType);

        const entitites: Entity[] = await db.offlineContent
            .where('entitytype')
            .equals(entityType)
            .toArray();

        const entityIds: number[] = [];

        entitites.forEach((entity) => {
            if (entity.entityid) {
                entityIds.push(entity.entityid);
            }
        });
        return entityIds;
    }

    /**
     * Entity with given entity type is returned. The first entity found will be returned.
     */
    async getEntityByType(entityType: EntityType): Promise<Entity> {
        console.log('get by type: ', entityType);

        const result = await db.offlineContent
            .where('entitytype')
            .equals(entityType)
            .first();
        if (result) {
            return result;
        } else {
            throw Error(
                `Entity with entity type ${entityType} was not found in offline database.`
            );
        }
    }

    /**
     * Return entity by type and id. If not found, error is thrown.
     */
    async getEntityByTypeAndId(
        entityType: EntityType,
        entityId: number,
        searchType?: SearchType
    ): Promise<Entity> {
        console.log('get by type and id: ', entityId, entityType, searchType);

        let updatedEntityType: string = entityType;

        if (searchType) {
            updatedEntityType = searchType + entityType;
        }

        const result = await db.offlineContent
            .where('entitytype')
            .equals(updatedEntityType)
            .and((entity: Entity) => entity.entityid == entityId)
            .first();

        if (result) {
            return result;
        } else {
            throw Error(
                `Entity by type ${entityType}, id ${entityId} and searchType ${searchType} is not found in offline database.`
            );
        }
    }

    /**
     * Add entity
     */
    async add(entity: Entity): Promise<EntityIndexes> {
        if (db.offlineContent !== undefined) {
            return await db.offlineContent.add(entity);
        }
        throw Error(`Entity ${entity.entityid} not added to database`);
    }

    /**
     * Add entities in a bulk operation.
     */

    async bulkAdd(entities: Entity[]): Promise<EntityIndexes> {
        if (db.offlineContent !== undefined) {
            return await db.offlineContent.bulkAdd(entities);
        }
        throw Error(`Entities ${entities} not added to database.`);
    }

    /**
     * Replaces the entity in the offline database, given that only the responseObj has changes.
     */
    async replaceEntity(entity: Entity): Promise<EntityIndexes> {
        if (db.offlineContent !== undefined) {
            const oldEntity = await this.getByApiPath(entity.apipath);
            if (!oldEntity) {
                console.error(
                    `The entity to replace does not exist in offline database. urlPath: ${entity.apipath}`
                );
                throw Error(
                    `The entity to replace does not exist in offline database. urlPath: ${entity.apipath}`
                );
            }

            return await db.offlineContent.put(entity);
        }
        console.error(
            `Entity ${entity.entityid} not updated in database. Offline content database not available. Url path: ${entity.apipath}`
        );
        throw Error(
            `Entity ${entity.entityid} not updated in database. Offline content database not available. Url path: ${entity.apipath}`
        );
    }
}

export { OfflineContentRepository };
