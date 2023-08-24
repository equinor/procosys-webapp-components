import { removeBaseUrlFromUrl } from '../services/apiHelpers';
import { OfflineSynchronizationError } from '../typings/apiTypes';
import { EntityType } from '../typings/enums';
import { FetchOperationProps } from '../typings/helperTypes';
import generateUniqueId from '../utils/generateUniqueId';

export enum RequestType {
    Json = 'json',
    Attachment = 'attachment',
}

export enum SyncStatus {
    SYNCHRONIZED = 'synchronized',
    NOT_SYNCHRONIZED = 'not syncronized',
    ERROR = 'error',
}

export class OfflineUpdateRequest {
    uniqueId: string; //We need this to be able to find and update a specific update request.
    url: string;
    method: string;
    bodyData: any;
    type: RequestType;
    entityId: number | null; //This will be id for checklist, punch or work order. All updates will belong to either of these.
    entityType:
        | EntityType.Checklist
        | EntityType.PunchItem
        | EntityType.WorkOrder
        | null;
    plantId: string;
    timestamp: number;
    responseIsNewEntityId = false;
    temporaryId?: number; //This must be set when we have a temporary generated id, and this id is not entityId (e.g. custom check item)
    syncStatus: SyncStatus = SyncStatus.NOT_SYNCHRONIZED;
    description: string | null;
    blob?: ArrayBuffer; //attachment object for offline content db
    mimeType?: string;
    errorCode?: number;
    errorMessage?: string;

    constructor(
        url: string,
        method: string,
        bodyData: any,
        type: any,
        timestamp: number,
        blob?: ArrayBuffer,
        mimeType?: string
    ) {
        //Get plantId
        const plantId = this.getPlantId(url);

        this.uniqueId = generateUniqueId();
        this.url = url;
        this.plantId = plantId;
        this.method = method;
        this.bodyData = bodyData;
        this.type = type;
        this.timestamp = timestamp;
        this.blob = blob;
        this.mimeType = mimeType;
        this.entityId = null;
        this.entityType = null;
        this.description = null;
    }

    getPlantId(url: string): string {
        const pos = url.indexOf('plantId=PCS$') + 'plantId=PCS$'.length;
        return url.substring(pos, url.indexOf('&', pos));
    }

    /**
     * Returns true if the were errors executing the update request.
     * Note: Must be a static function, because objects stored in indexeddb will not include object functions.
     */
    static hasError(updateRequest: OfflineUpdateRequest): boolean {
        if (updateRequest.errorCode) {
            return true;
        }
        return false;
    }

    /**
     * Return an object containing information about the error occured when executing the update request.
     */
    static getErrorObject(
        updateRequest: OfflineUpdateRequest
    ): OfflineSynchronizationError {
        return {
            Id: updateRequest.entityId || 0,
            Url: updateRequest.url,
            Method: updateRequest.method,
            ErrorMsg: updateRequest.errorMessage || 'No error',
            ErrorCode: updateRequest.errorCode || 0,
        };
    }

    /**
     * Build an object for storing all necessary information about the update request.
     */
    static async buildOfflineRequestObject(
        fetchOperation: FetchOperationProps,
        endpoint: string
    ): Promise<OfflineUpdateRequest> {
        const headers = fetchOperation.headers;
        const contentType = headers.get('Content-Type');

        const url = removeBaseUrlFromUrl(endpoint);

        let type;
        let bodyData;
        let blob;
        let mimeType;

        if (fetchOperation.body) {
            if (typeof fetchOperation.body === 'string') {
                //json
                bodyData = JSON.parse(fetchOperation.body);
                type = RequestType.Json;
            } else if (contentType.includes('form-data')) {
                //attachment
                const formData = fetchOperation.body;
                const tempData = new Map();
                let arrayBuffer;
                for (const [key, value] of formData) {
                    const tempBlob = value as File;
                    mimeType = tempBlob.type;
                    arrayBuffer = await tempBlob.arrayBuffer();
                    tempData.set(key, arrayBuffer);
                }

                type = RequestType.Attachment;
                blob = arrayBuffer;

                bodyData = tempData;
            } else {
                console.error(
                    `Not able to add body data with ContentType ${contentType} when building request object for ${url}`
                );
            }
        }

        return new OfflineUpdateRequest(
            url,
            fetchOperation.method,
            bodyData,
            type,
            Date.now(),
            blob,
            mimeType
        );
    }
}
