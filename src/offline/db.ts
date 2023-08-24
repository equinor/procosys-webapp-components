import Dexie, { Table } from 'dexie';
import { applyEncryptionMiddleware, cryptoOptions } from 'dexie-encrypted';
import { IEntity } from '../typings/helperTypes';
import { Entity, EntityIndexes } from './Entity';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

const nacl = require('tweetnacl');

export default class OfflineStorage extends Dexie {
    offlineContent!: Table<IEntity, EntityIndexes>;
    offlineUpdates!: Table<OfflineUpdateRequest>;
    static offlineContent: any;

    constructor() {
        super('ProCoSysMcAppDB');
    }

    notAbleToDecrypt<T extends Dexie>(db: T): Promise<void[]> {
        console.error(
            'Was not able to decrypt the offline database with the given user pin.'
        );
        return Promise.resolve([]);
    }

    /**
     * Initialize the database
     */
    async init(userPin: string): Promise<void> {
        if (this.isOpen()) {
            this.close();
        }
        this.version(1).stores({
            offlineContent:
                'apipath, parententityid, entityid, entitytype, searchtype',
            offlineUpdates: 'seqno++, entityid, uniqueId',
        });

        this?.offlineContent.mapToClass(Entity);
        this?.offlineUpdates.mapToClass(OfflineUpdateRequest);

        this.encryptDatabase(userPin);

        if (!this.isOpen()) {
            await this.open();
        }
    }

    /**
     * Apply Encryption on database using user pin as key.
     */
    private encryptDatabase(userPin: string): void {
        const secret = new Uint8Array(32);
        for (let i = 0; i < userPin.length; i++) {
            secret[i] = Number(userPin.charAt(i));
        }
        const keyPair = nacl.sign.keyPair.fromSeed(secret);
        applyEncryptionMiddleware(
            db,
            keyPair.publicKey,
            {
                offlineContent: cryptoOptions.NON_INDEXED_FIELDS,
                offlineUpdates: cryptoOptions.NON_INDEXED_FIELDS,
            },
            this.notAbleToDecrypt
        );
    }

    public async reInitAndVerifyPin(userPin: string): Promise<boolean> {
        console.log('starting to init user pin');
        await this.init(userPin);
        console.log('init user pin is done');

        //Check that we are able to encrypt data from the database
        try {
            const testEntity = await db.offlineContent
                .where('entitytype')
                .equals('test')
                .first();
            if (testEntity && (await testEntity.responseObj) == 'test') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Not able to fetch data from encrypted database.');
        }
        return false;
    }

    /**
     * Creates new database. Must be called when a new database is to be created.
     */
    public async create(userPin: string): Promise<void> {
        await this.delete();

        this.init(userPin);

        //Add a test row. Will be used to verify userpin.
        const testEntity: Entity = {
            apipath: 'test',
            responseObj: 'test',
            entitytype: 'test',
            entityid: 0,
            parententityid: 0,
        };
        await this.offlineContent.add(testEntity);
    }
}

export const db = new OfflineStorage();
