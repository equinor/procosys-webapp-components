import React, { useState } from 'react';
import {
    LibrayTypes,
    PunchCategory,
    PunchItem,
} from '../../typings/apiTypes';
import { AsyncStatus } from '../../typings/enums';
import { PunchEndpoints, UpdatePunchData } from '../../typings/helperTypes';
import ensure from '../../utils/ensure';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useClearPunchFacade = (
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>,
    punchEndpoints: PunchEndpoints,
    updateDatabase: (
        endpoint: string,
        updateData: UpdatePunchData
    ) => Promise<void>,
    organizations: LibrayTypes[],
    categories: PunchCategory[],
    types: LibrayTypes[],
    sortings: LibrayTypes[],
    priorities: LibrayTypes[],
    setClearPunchStatus: React.Dispatch<React.SetStateAction<AsyncStatus>>,
    redirectAfterClearing: () => void,
    clearPunch: () => Promise<void>
) => {
    const [showPersonsSearch, setShowPersonsSearch] = useState(false);

    const getDefaultOrganization = (guid: string): string => {
        const defaultId = organizations?.find((org) => org.guid === guid)?.guid;
        return defaultId ? defaultId : "-1";
    };

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const code = e.target.value;
        setPunchItem((prev) => ({
            ...prev,
            category: ensure(
                categories.find((category) => category.code === code)
            ).code,
        }));
        updateDatabase(punchEndpoints.updateCategory, code);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            description: e.target.value,
        }));

    const handleRaisedByChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const raisedByOrgGuid = e.target.value
        setPunchItem((prev) => ({
            ...prev,
            raisedByCode: ensure(
                organizations.find(
                    (org) => org.guid === raisedByOrgGuid
                )
            ).code,
        }));
        updateDatabase(punchEndpoints.updateRaisedBy, raisedByOrgGuid);
    };

    const handleClearingByChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const clearingByOrgGuid = e.target.value;
        setPunchItem((prev) => ({
            ...prev,
            clearingByCode: ensure(
                organizations.find(
                    (org) => org.guid === clearingByOrgGuid
                )
            ).code,
        }));
        updateDatabase(punchEndpoints.updateClearingBy, clearingByOrgGuid);
    };

    const handleActionByPersonChange = (
        azureOid: string | null,
        firstName: string,
        lastName: string
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            actionBy: {...prev.actionBy, azureOid, firstName, lastName}
        }));
        updateDatabase(punchEndpoints.updateActionByPerson, azureOid);
        setShowPersonsSearch(false);
    };

    const handleDueDateChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            dueTimeUtc: new Date(e.target.value).toISOString(),
        }));

    const handleTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            typeCode: ensure(
                types.find((type) => type.guid === e.target.value)
            ).code,
        }));
        updateDatabase(punchEndpoints.updateType, e.target.value);
    };

    const handleSortingChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            sorting: ensure(
                sortings.find((sort) => sort.guid === e.target.value)
            ),
        }));
        updateDatabase(punchEndpoints.updateSorting, e.target.value);
    };

    const handlePriorityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            priorityCode: ensure(
                priorities.find(
                    (priority) => priority.guid === e.target.value
                )
            ).code,
        }));
        updateDatabase(punchEndpoints.updatePriority, e.target.value);
    };

    const handleEstimateChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            estimate: parseInt(e.target.value),
        }));

    const clearPunchItem = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setClearPunchStatus(AsyncStatus.LOADING);
        try {
            await clearPunch();
            setClearPunchStatus(AsyncStatus.SUCCESS);
            redirectAfterClearing();
        } catch (error) {
            setClearPunchStatus(AsyncStatus.ERROR);
        }
    };

    return {
        clearPunchItem,
        handleCategoryChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleDescriptionChange,
        handleActionByPersonChange,
        handleDueDateChange,
        handleSortingChange,
        handlePriorityChange,
        handleEstimateChange,
        showPersonsSearch,
        setShowPersonsSearch,
        getDefaultOrganization,
    };
};

export default useClearPunchFacade;
