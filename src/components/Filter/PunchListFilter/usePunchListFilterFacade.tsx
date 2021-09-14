import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { PunchPreview } from '../../../services/apiTypes';
import useFilterFacade, { Filter } from '../useFilter';
import { filterPunchPreviews } from './filterPunchPreviews';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePunchListFilterFacade = (
    setFilterCount: React.Dispatch<React.SetStateAction<number>>,
    setShownPunches: React.Dispatch<
        React.SetStateAction<PunchPreview[] | undefined>
    >,
    allPunches?: PunchPreview[]
) => {
    const [filter, setFilter] = useState<Filter>({
        status: [],
        signature: '',
        responsible: '',
        formType: '',
    });
    const [responsibles, setResponsibles] = useState<string[]>();
    const [formTypes, setFormTypes] = useState<string[]>();

    const {
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    } = useFilterFacade(setFilter);

    useEffect(() => {
        const uniqueResponsibles = new Set<string>();
        const uniqueFormTypes = new Set<string>();
        allPunches?.map((item) => {
            uniqueResponsibles.add(item.responsibleCode);
            uniqueFormTypes.add(item.formularType);
        });
        setResponsibles(Array.from(uniqueResponsibles));
        setFormTypes(Array.from(uniqueFormTypes));
    }, [allPunches]);

    useEffect(() => {
        if (allPunches != undefined) {
            const { filteredPunchPreviews, filterCount } = filterPunchPreviews(
                allPunches,
                filter
            );
            setShownPunches(filteredPunchPreviews);
            setFilterCount(filterCount);
        } else {
            return;
        }
    }, [filter, allPunches]);

    const handleStatusChange = (status: string): void => {
        if (allPunches != undefined) {
            if (status === 'All') {
                setFilter((prevFilter) => ({ ...prevFilter, status: [] }));
            } else {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: [status],
                }));
            }
        }
    };

    return {
        filter,
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    };
};

export default usePunchListFilterFacade;
