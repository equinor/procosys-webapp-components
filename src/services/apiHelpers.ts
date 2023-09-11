import {
    FetchOperationProps,
    IEntity,
    ProcosysApiSettings,
} from '../typings/helperTypes';
import objectToCamelCase from '../utils/objectToCamelCase';
import { HTTPError } from './HTTPError';

/**
 * Remove baseurl, including /api/.
 */
export const removeBaseUrlFromUrl = (fullUrl: string): string => {
    return fullUrl.substring(
        fullUrl.indexOf('/api/') + 5, //todo: is there a better way?
        fullUrl.length
    );
};

export const updateOfflineEntityObj = (
    entity: IEntity,
    resultObj: any,
    apiPath: string
): void => {
    entity.responseObj = resultObj;
    entity.apipath = removeBaseUrlFromUrl(apiPath);
};

export const getErrorMessage = async (response: Response): Promise<string> => {
    let errorMessage;
    const text = await response.text();
    if (text) {
        errorMessage = text;
    } else {
        errorMessage = `Server responded with http error code ${response.status}. ${response.statusText}`;
    }
    console.error('Error occured on server call.', errorMessage);
    return errorMessage;
};

/**
 * Generic method for doing a GET call. Should be used by all GET calls with json string (or blank) as respons.
 */
export const getByFetch = async (
    { baseURL, token }: ProcosysApiSettings,
    url: string,
    abortSignal?: AbortSignal,
    entity?: IEntity
): Promise<any> => {
    const myToken = await token;
    const GetOperation: FetchOperationProps = {
        abortSignal: abortSignal,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${myToken}`,
        },
    };
    const res = await fetch(`${baseURL}/${url}`, GetOperation);
    if (res.ok) {
        const jsonResult = await res.json();
        const resultObj = objectToCamelCase(jsonResult);
        entity && updateOfflineEntityObj(entity, resultObj, res.url);
        return resultObj;
    } else {
        console.error('Get by fetch failed. Url=' + url, res);
        throw new HTTPError(res.status, res.statusText);
    }
};

/**
 * Generic method for doing a GET call with attachment blob as response.
 */
export const getAttachmentByFetch = async (
    { baseURL, token }: ProcosysApiSettings,
    url: string,
    abortSignal?: AbortSignal,
    entity?: IEntity
): Promise<Blob> => {
    const myToken = await token;
    const GetOperation: FetchOperationProps = {
        abortSignal: abortSignal,
        method: 'GET',
        responseType: 'blob',
        headers: {
            Authorization: `Bearer ${myToken}`,
            'Content-Disposition': 'attachment; filename="filename.jpg"',
        },
    };

    const res = await fetch(`${baseURL}/${url}`, GetOperation);

    if (res.ok) {
        const blob = await res.blob();

        //ArrayBuffer must be used for storing in indexeddb (blob not supported by all browser, and not supported by Dexie-encrypted)
        const arrayBuffer = await blob.arrayBuffer();
        entity && updateOfflineEntityObj(entity, arrayBuffer, res.url);
        return blob;
    } else {
        console.error('Get attachment by fetch failed. Url=' + url, res);
        throw new HTTPError(res.status, res.statusText);
    }
};

/**
 * Generic method for doing a DELETE call. Should be used by all DELETE calls.
 */
export const deleteByFetch = async (
    { baseURL, token }: ProcosysApiSettings,
    url: string,
    data?: any
): Promise<any> => {
    const myToken = await token;
    const DeleteOperation = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${myToken}`,
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
    };
    const response = await fetch(`${baseURL}/${url}`, DeleteOperation);

    if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new HTTPError(response.status, errorMessage);
    }
};

/**
 * Generic method for doing a POST call with json as body data.
 * If the request fails because of http error code from server, HTTPError will be thrown.
 * If the request fails because of network issues etc, Error will be thrown.
 */
export const postByFetch = async (
    { baseURL, token }: ProcosysApiSettings,
    url: string,
    bodyData?: any
): Promise<any> => {
    const myToken = await token;
    const PostOperation = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${myToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    };

    let response = new Response();
    try {
        response = await fetch(`${baseURL}/${url}`, PostOperation);
    } catch (error) {
        console.error('Something went wrong when accessing the server.', error);
        throw new Error('Something went wrong when accessing the server.');
    }

    if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            const jsonResult = await response.json();
            const resultObj = objectToCamelCase(jsonResult);
            return resultObj;
        } else if (contentType === 'text/plain;charset=UTF-8') {
            const textResponse = await response.text();
            return await JSON.parse(textResponse);
        } else {
            return;
        }
    } else {
        const errorMessage = await getErrorMessage(response);
        console.error('Error occured on postByFetch', errorMessage);
        throw new HTTPError(response.status, errorMessage);
    }
};

/**
 * Generic method for doing a POST call with json as body data without the need for a token or a base URL
 * If the request fails because of http error code from server, HTTPError will be thrown.
 * If the request fails because of network issues etc, Error will be thrown.
 */
export const postByFetchSimple = async (
    url: string,
    bodyData?: any
): Promise<any> => {
    const PostOperation = {
        method: 'POST',
        body: JSON.stringify(bodyData),
    };

    let response = new Response();
    try {
        response = await fetch(url, PostOperation);
    } catch (error) {
        console.error('Something went wrong when accessing the server.', error);
        throw new Error('Something went wrong when accessing the server.');
    }

    if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return await response.json();
        } else {
            return;
        }
    } else {
        const errorMessage = await getErrorMessage(response);
        console.error('Error occured on postByFetch', errorMessage);
        throw new HTTPError(response.status, errorMessage);
    }
};

/**
 * Generic method for posting attachment with form data as body data.
 */
export const postAttachmentByFetch = async (
    { baseURL, token }: ProcosysApiSettings,
    url: string,
    file: FormData,
    returnId: boolean,
    entity?: IEntity
): Promise<any> => {
    const myToken = await token;
    const PostOperation = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${myToken}`,
        },
        body: file,
    };
    const response = await fetch(`${baseURL}/${url}`, PostOperation);
    if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new HTTPError(response.status, errorMessage);
    }
    if (returnId == true) {
        const jsonResult = await response.json();
        const resultObj = objectToCamelCase(jsonResult);

        entity && updateOfflineEntityObj(entity, resultObj, response.url);

        return resultObj;
    }
};

/**
 * Generic method for doing a PUT call.
 */
export const putByFetch = async (
    { baseURL, token }: ProcosysApiSettings,
    url: string,
    bodyData: any,
    additionalHeaders?: any
): Promise<any> => {
    const myToken = await token;
    const PutOperation = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${myToken}`,
            ...additionalHeaders,
        },
        body: JSON.stringify(bodyData),
    };
    const response = await fetch(`${baseURL}/${url}`, PutOperation);
    if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new HTTPError(response.status, errorMessage);
    }
};
