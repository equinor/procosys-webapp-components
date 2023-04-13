import { IEntity } from '../typings/helperTypes';

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
