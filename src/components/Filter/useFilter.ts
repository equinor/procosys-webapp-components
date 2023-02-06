import React from 'react';
import { DocumentFilterType } from './DocumentFilter/filterDocuments';

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
    mcPkg: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useFilterFacade = (
    setFilter: React.Dispatch<React.SetStateAction<Filter>>
) => {
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

    const handleMcPkgChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            mcPkg: e.target.value,
        }));
    };

    return {
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
        handleMcPkgChange,
    };
};

export default useFilterFacade;
