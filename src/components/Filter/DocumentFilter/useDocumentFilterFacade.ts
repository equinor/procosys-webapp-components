import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Document } from '../../../typings/apiTypes';
import { DocumentFilterType, filterDocuments } from './filterDocuments';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useDocumentFilterFacade = (
    setFilterCount: React.Dispatch<React.SetStateAction<number>>,
    setFilteredDocuments: React.Dispatch<
        React.SetStateAction<Document[] | undefined>
    >,
    allDocuments?: Document[]
) => {
    const [filter, setFilter] = useState<DocumentFilterType>({
        documentRelationType: [],
    });
    const [relationTypes, setRelationTypes] = useState<string[]>();

    useEffect(() => {
        const uniqueRelationTypes = new Set<string>();
        allDocuments?.map((item) => {
            uniqueRelationTypes.add(item.relationType);
        });
        setRelationTypes(Array.from(uniqueRelationTypes));
    }, [allDocuments]);

    useEffect(() => {
        if (allDocuments != undefined) {
            const { filteredDocuments, filterCount } = filterDocuments(
                allDocuments,
                filter
            );
            setFilteredDocuments(filteredDocuments);
            setFilterCount(filterCount);
        } else {
            return;
        }
    }, [filter, allDocuments]);

    const handleRelationTypeChange = (relationType: string): void => {
        if (allDocuments === undefined) return;
        if (filter.documentRelationType.indexOf(relationType) === -1) {
            setFilter((prevFilter) => ({
                ...prevFilter,
                documentRelationType: [
                    ...prevFilter.documentRelationType,
                    relationType,
                ],
            }));
        } else {
            setFilter((prevFilter) => ({
                ...prevFilter,
                documentRelationType: prevFilter.documentRelationType.filter(
                    (item) => {
                        return item != relationType;
                    }
                ),
            }));
        }
    };

    return {
        filter,
        handleRelationTypeChange,
        relationTypes,
    };
};

export default useDocumentFilterFacade;
