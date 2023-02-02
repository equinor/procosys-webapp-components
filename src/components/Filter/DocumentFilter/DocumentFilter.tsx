import React, { useState } from 'react';
import { Checkbox, Label, NativeSelect, Radio } from '@equinor/eds-core-react';
import EdsIcon from '../../icons/EdsIcon';
import {
    FilterButton,
    FilterWrapper,
} from '../PunchListFilter/PunchListFilter';
import { SelectFieldsWrapper } from '../PunchListFilter/SelectFields';
import { Document } from '../../../typings/apiTypes';
import useDocumentFilterFacade from './useDocumentFilterFacade';

type FilterProps = {
    setFilteredDocuments: React.Dispatch<
        React.SetStateAction<Document[] | undefined>
    >;
    documents?: Document[];
};

const DocumentFilter = ({
    setFilteredDocuments,
    documents,
}: FilterProps): JSX.Element => {
    const [filterCount, setFilterCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { handleRelationTypeChange, relationTypes } = useDocumentFilterFacade(
        setFilterCount,
        setFilteredDocuments,
        documents
    );

    return (
        <FilterWrapper>
            <FilterButton
                isActive={filterCount > 0}
                onClick={(): void => {
                    setIsOpen((prevIsOpen) => !prevIsOpen);
                }}
                role="button"
                aria-label="filter button"
            >
                <p>
                    {isOpen ? 'Hide' : 'Show'} filter
                    {filterCount > 0 ? ` (${filterCount})` : ''}
                </p>
                <EdsIcon name={isOpen ? 'chevron_up' : 'chevron_down'} />
            </FilterButton>
            {isOpen ? (
                <div>
                    <Label label="Document type" />
                    <div>
                        {relationTypes?.map((relationType) => {
                            return (
                                <Checkbox
                                    key={relationType}
                                    label={relationType}
                                    onChange={(): void => {
                                        handleRelationTypeChange(relationType);
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </FilterWrapper>
    );
};

export default DocumentFilter;
