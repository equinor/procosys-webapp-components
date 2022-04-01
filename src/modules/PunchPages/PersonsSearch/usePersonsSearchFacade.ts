import React, { useEffect, useReducer, useState } from 'react';
import { CancelToken, CancelTokenSource } from 'axios';
import { SearchStatus } from '../../../typings/enums';
import { Person } from '../../../typings/apiTypes';
import { SearchResult, SearchState } from '../../../typings/helperTypes';

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: SearchResult }
    | { type: 'FETCH_ERROR'; error: string }
    | { type: 'FETCH_INACTIVE' };

const fetchReducer = (state: SearchState, action: Action): SearchState => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                searchStatus: SearchStatus.LOADING,
                hits: { ...state.hits, persons: [] },
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                searchStatus: SearchStatus.SUCCESS,
                hits: action.payload,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                searchStatus: SearchStatus.ERROR,
            };
        case 'FETCH_INACTIVE':
            return {
                ...state,
                searchStatus: SearchStatus.INACTIVE,
                hits: { ...state.hits, persons: [] },
            };
    }
};

const fetchHits = async (
    plantId: string,
    query: string,
    dispatch: React.Dispatch<Action>,
    getPersonsByName: (
        plantId: string,
        searchString: string,
        cancelToken: CancelToken
    ) => Promise<Person[]>,
    cancelToken: CancelToken
): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
        const persons = await getPersonsByName(plantId, query, cancelToken);
        dispatch({
            type: 'FETCH_SUCCESS',
            payload: { persons },
        });
    } catch (err) {
        dispatch({ type: 'FETCH_ERROR', error: 'err' });
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePersonsSearchFacade = (
    plantId: string,
    getPersonsByName: (
        plantId: string,
        searchString: string,
        cancelToken: CancelToken
    ) => Promise<Person[]>,
    source: CancelTokenSource
) => {
    const [{ hits, searchStatus }, dispatch] = useReducer(fetchReducer, {
        hits: { persons: [] },
        searchStatus: SearchStatus.INACTIVE,
    });
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (query.length < 2) {
            dispatch({ type: 'FETCH_INACTIVE' });
            return;
        }
        const timeOutId = setTimeout(
            () =>
                fetchHits(
                    plantId,
                    query,
                    dispatch,
                    getPersonsByName,
                    source.token
                ),
            300
        );
        return (): void => {
            clearTimeout(timeOutId);
        };
    }, [query, plantId]);

    return {
        hits,
        searchStatus,
        query,
        setQuery,
    };
};

export default usePersonsSearchFacade;
