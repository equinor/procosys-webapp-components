import { Person } from './apiTypes';
import { SearchType, SearchStatus } from './enums';

export type ChosenPerson = {
    id: string | null;
    name: string;
};

export type PunchFormData = {
    category: string;
    description: string;
    raisedBy: string;
    clearingBy: string;
    dueDate: string;
    type: string;
    sorting: string;
    priority: string;
    estimate: string;
};

export type PunchEndpoints = {
    updateCategory: string;
    updateDescription: string;
    updateRaisedBy: string;
    updateClearingBy: string;
    updateActionByPerson: string;
    updateDueDate: string;
    updateType: string;
    updateSorting: string;
    updatePriority: string;
    updateEstimate: string;
};

export type UpdatePunchData = string | number | null

// export type UpdatePunchData =
//     | { CategoryId: number }
//     | { description: string }
//     | { raisedByOrgGuid: string }
//     | { clearingByOrgGuid: string }
//     | { actionByPersonOid: number | null }
//     | { dueTimeUtc: string | null }
//     | { typeGuid: number }
//     | { sortingGuid: string }
//     | { priorityGuid: string }
//     | { estimate: number | null };

export type SearchResult = {
    persons: Person[];
};

export type SearchState = {
    searchStatus: SearchStatus;
    hits: SearchResult;
};

export type IEntity = {
    apipath: string;
    responseObj: any;
    entitytype: string;
    entityid?: number;
    parententityid?: number;
    searchtype?: SearchType;
};

export type FetchOperationProps = {
    abortSignal?: AbortSignal;
    method: string;
    headers: any;
    responseType?: string;
    body?: string | FormData;
};

export type ProcosysApiSettings = {
    baseURL: string;
    token: Promise<string>;
};
