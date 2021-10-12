import React, { useState } from 'react';
import { Checkbox, Label, NativeSelect, Radio } from '@equinor/eds-core-react';
import { ChecklistPreview } from '../../../services/apiTypes';
import { Signatures } from '../useFilter';
import EdsIcon from '../../icons/EdsIcon';
import useScopeFilterFacade from './useScopeFilterFacade';
import {
    FilterButton,
    FilterWrapper,
    SelectFieldsWrapper,
} from '../PunchListFilter/PunchListFilter';

type FilterProps = {
    setShownScope: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | undefined>
    >;
    scopeItems?: ChecklistPreview[];
    isPoScope?: boolean;
};

const ScopeFilter = ({
    setShownScope,
    scopeItems,
    isPoScope,
}: FilterProps): JSX.Element => {
    const [filterCount, setFilterCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [signatureChosen, setSignatureChosen] = useState<string>('All');
    const {
        filter,
        statuses,
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    } = useScopeFilterFacade(setFilterCount, setShownScope, scopeItems);

    const determineStatusFieldsToRender = (): JSX.Element => {
        return (
            <div>
                {statuses?.map((status) => {
                    return (
                        <Checkbox
                            key={status}
                            label={status}
                            onChange={(): void => {
                                handleStatusChange(status);
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    const determineSignatureFieldsToRender = (): JSX.Element => {
        return (
            <>
                <Radio
                    label="All"
                    checked={signatureChosen === 'All'}
                    onChange={(): void => {
                        handleSignatureChange('');
                        setSignatureChosen('All');
                    }}
                />
                <Radio
                    label={Signatures.NOT_SIGNED}
                    checked={signatureChosen === Signatures.NOT_SIGNED}
                    onChange={(): void => {
                        handleSignatureChange(Signatures.NOT_SIGNED);
                        setSignatureChosen(Signatures.NOT_SIGNED);
                    }}
                />
                <Radio
                    label={Signatures.SIGNED}
                    checked={signatureChosen === Signatures.SIGNED}
                    onChange={(): void => {
                        handleSignatureChange(Signatures.SIGNED);
                        setSignatureChosen(Signatures.SIGNED);
                    }}
                />
            </>
        );
    };

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
                    <Label label="Status" />
                    {determineStatusFieldsToRender()}
                    <Label label="Signatures" />
                    {determineSignatureFieldsToRender()}
                    <SelectFieldsWrapper>
                        <NativeSelect
                            id="ResponsibleSelect"
                            label="Responsible"
                            defaultValue={
                                filter.responsible
                                    ? responsibles?.find(
                                          (responsible) =>
                                              responsible === filter.responsible
                                      )
                                    : ''
                            }
                            onChange={handleResponsibleChange}
                        >
                            <option key="Empty" value="">
                                Select
                            </option>
                            {responsibles?.map((responsible) => (
                                <option key={responsible} value={responsible}>
                                    {responsible}
                                </option>
                            ))}
                        </NativeSelect>
                        {isPoScope ? null : (
                            <NativeSelect
                                id="FormTypeSelect"
                                label="Form type"
                                defaultValue={
                                    filter.formType
                                        ? formTypes?.find(
                                              (formType) =>
                                                  formType === filter.formType
                                          )
                                        : ''
                                }
                                onChange={handleFormTypeChange}
                            >
                                <option key="Empty" value="">
                                    Select
                                </option>
                                {formTypes?.map((formType) => (
                                    <option key={formType} value={formType}>
                                        {formType}
                                    </option>
                                ))}
                            </NativeSelect>
                        )}
                    </SelectFieldsWrapper>
                </div>
            ) : null}
        </FilterWrapper>
    );
};

export default ScopeFilter;
