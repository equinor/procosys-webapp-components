import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChecklistPreview } from '../../../typings/apiTypes';
import useFilterFacade, { Filter } from '../useFilter';
import { filterChecklistPreviews } from './filterChecklistPreviews';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useScopeFilterFacade = (
    setFilterCount: React.Dispatch<React.SetStateAction<number>>,
    setFilteredScope: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | undefined>
    >,
    allChecklists?: ChecklistPreview[]
) => {
    const [filter, setFilter] = useState<Filter>({
        status: [],
        signature: '',
        responsible: '',
        formType: '',
        mcPkg: '',
    });
    const [statuses, setStatuses] = useState<string[]>();
    const [responsibles, setResponsibles] = useState<string[]>();
    const [formTypes, setFormTypes] = useState<string[]>();
    const [mcPkgs, setMcPkgs] = useState<string[]>();

    const {
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
        handleMcPkgChange,
    } = useFilterFacade(setFilter);

    useEffect(() => {
        const uniqueResponsibles = new Set<string>();
        const uniqueFormTypes = new Set<string>();
        const uniqueMcPkgs = new Set<string>();
        const uniqueStatuses = new Set<string>();
        allChecklists?.map((item) => {
            uniqueResponsibles.add(item.responsibleCode);
            uniqueFormTypes.add(item.formularType);
            uniqueStatuses.add(item.status);
            item.mcPkgNo ? uniqueMcPkgs.add(item.mcPkgNo) : null;
        });
        setResponsibles(Array.from(uniqueResponsibles));
        setFormTypes(Array.from(uniqueFormTypes));
        setMcPkgs(Array.from(uniqueMcPkgs));
        setStatuses(Array.from(uniqueStatuses));
    }, [allChecklists]);

    useEffect(() => {
        if (allChecklists != undefined) {
            const { filteredChecklistPreviews, filterCount } =
                filterChecklistPreviews(allChecklists, filter);
            setFilteredScope(filteredChecklistPreviews);
            setFilterCount(filterCount);
        } else {
            return;
        }
    }, [filter, allChecklists]);

    const handleStatusChange = (status: string): void => {
        if (allChecklists === undefined) return;
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
    };

    return {
        filter,
        statuses,
        responsibles,
        formTypes,
        mcPkgs,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
        handleMcPkgChange,
    };
};

export default useScopeFilterFacade;
