import React, { useState } from 'react';
import {
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchSort,
    PunchPriority,
    PunchItem,
} from '../../typings/apiTypes';
import { AsyncStatus } from '../../typings/enums';
import ensure from '../../utils/ensure';
import { PunchEndpoints, UpdatePunchData } from '../../typings/helperTypes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useClearPunchFacade = (
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>,
    punchEndpoints: PunchEndpoints,
    updateDatabase: (
        endpoint: string,
        updateData: UpdatePunchData
    ) => Promise<void>,
    organizations: PunchOrganization[],
    categories: PunchCategory[],
    types: PunchType[],
    sortings: PunchSort[],
    priorities: PunchPriority[],
    setClearPunchStatus: React.Dispatch<React.SetStateAction<AsyncStatus>>,
    redirectAfterClearing: () => void,
    clearPunch: () => Promise<void>
) => {
    const [showPersonsSearch, setShowPersonsSearch] = useState(false);

    const getDefaultOrganization = (code: string): number => {
        const defaultId = organizations?.find((org) => org.code === code)?.id;
        return defaultId ? defaultId : -1;
    };

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const newCategoryId = parseInt(e.target.value);
        setPunchItem((prev) => ({
            ...prev,
            status: ensure(
                categories.find((category) => category.id === newCategoryId)
            ).code,
        }));
        updateDatabase(punchEndpoints.updateCategory, {
            CategoryId: newCategoryId,
        });
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
        const newRaisedByOrganizationId = parseInt(e.target.value);
        setPunchItem((prev) => ({
            ...prev,
            raisedByCode: ensure(
                organizations.find(
                    (org) => org.id === newRaisedByOrganizationId
                )
            ).code,
        }));
        updateDatabase(punchEndpoints.updateRaisedBy, {
            RaisedByOrganizationId: newRaisedByOrganizationId,
        });
    };

    const handleClearingByChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const newClearingByOrganizationId = parseInt(e.target.value);
        setPunchItem((prev) => ({
            ...prev,
            clearingByCode: ensure(
                organizations.find(
                    (org) => org.id === newClearingByOrganizationId
                )
            ).code,
        }));
        updateDatabase(punchEndpoints.updateClearingBy, {
            ClearingByOrganizationId: newClearingByOrganizationId,
        });
    };

    const handleActionByPersonChange = (
        id: number | null,
        firstName: string,
        lastName: string
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            actionByPerson: id,
            actionByPersonFirstName: firstName,
            actionByPersonLastName: lastName,
        }));
        updateDatabase(punchEndpoints.updateActionByPerson, {
            PersonId: id,
        });
        setShowPersonsSearch(false);
    };

    const handleDueDateChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            dueDate: e.target.value,
        }));

    const handleTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            typeCode: ensure(
                types.find((type) => type.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(punchEndpoints.updateType, {
            TypeId: parseInt(e.target.value),
        });
    };

    const handleSortingChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            sorting: ensure(
                sortings.find((sort) => sort.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(punchEndpoints.updateSorting, {
            SortingId: parseInt(e.target.value),
        });
    };

    const handlePriorityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            priorityCode: ensure(
                priorities.find(
                    (priority) => priority.id === parseInt(e.target.value)
                )
            ).code,
        }));
        updateDatabase(punchEndpoints.updatePriority, {
            PriorityId: parseInt(e.target.value),
        });
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
