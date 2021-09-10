import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChecklistPreview, PunchPreview } from '../../services/apiTypes';
import { filterChecklistPreviews } from './filterChecklistPreviews';
import { filterPunchPreviews } from './filterPunchPreviews';

export enum Signatures {
    NOT_CLEARED = 'Not cleared',
    CLEARED = 'Cleared not verified',
    NOT_SIGNED = 'Not signed',
    SIGNED = 'Signed not verified',
}

export type Filter = {
    status: string[];
    signature: string;
    responsible: string;
    formType: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useFilterFacade = (
    setFilterCount: React.Dispatch<React.SetStateAction<number>>,
    setShownScope?: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | undefined>
    >,
    setShownPunches?: React.Dispatch<
        React.SetStateAction<PunchPreview[] | undefined>
    >,
    scopeItems?: ChecklistPreview[],
    punchItems?: PunchPreview[]
) => {
    const [filter, setFilter] = useState<Filter>({
        status: [],
        signature: '',
        responsible: '',
        formType: '',
    });
    const [statuses, setStatuses] = useState<string[]>();
    const [responsibles, setResponsibles] = useState<string[]>();
    const [formTypes, setFormTypes] = useState<string[]>();

    useEffect(() => {
        let allItems = null;
        if (scopeItems) {
            allItems = scopeItems;
        } else if (punchItems) {
            allItems = punchItems;
        }
        const uniqueResponsibles = new Set<string>();
        const uniqueFormTypes = new Set<string>();
        const uniqueStatuses = new Set<string>();
        allItems?.map((item) => {
            uniqueResponsibles.add(item.responsibleCode);
            uniqueFormTypes.add(item.formularType);
            uniqueStatuses.add(item.status);
        });
        setStatuses(Array.from(uniqueStatuses));
        setResponsibles(Array.from(uniqueResponsibles));
        setFormTypes(Array.from(uniqueFormTypes));
    }, [scopeItems, punchItems]);

    useEffect(() => {
        if (punchItems != undefined && setShownPunches != undefined) {
            const { filteredPunchPreviews, filterCount } = filterPunchPreviews(
                punchItems,
                filter
            );
            setShownPunches(filteredPunchPreviews);
            setFilterCount(filterCount);
        } else if (scopeItems != undefined && setShownScope != undefined) {
            const { filteredChecklistPreviews, filterCount } =
                filterChecklistPreviews(scopeItems, filter);
            setShownScope(filteredChecklistPreviews);
            setFilterCount(filterCount);
        } else {
            return;
        }
    }, [filter, scopeItems, punchItems]);

    const handleStatusChange = (status: string): void => {
        if (punchItems != undefined) {
            if (status === 'All') {
                setFilter((prevFilter) => ({ ...prevFilter, status: [] }));
            } else {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: [status],
                }));
            }
        } else if (scopeItems != undefined) {
            if (filter.status.indexOf(status) === -1) {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: [...prevFilter.status, status],
                }));
            } else {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: prevFilter.status.filter((item) => {
                        return item != status;
                    }),
                }));
            }
        }
    };

    const handleSignatureChange = (signature: string): void => {
        setFilter((prevFilter) => ({ ...prevFilter, signature }));
    };

    const handleResponsibleChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            responsible: e.target.value,
        }));
    };

    const handleFormTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            formType: e.target.value,
        }));
    };

    return {
        filter,
        statuses,
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    };
};

export default useFilterFacade;
