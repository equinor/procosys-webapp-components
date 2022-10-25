import React, { useState } from 'react';
import { Checkbox, Label, NativeSelect, Radio } from '@equinor/eds-core-react';
import { Signatures } from '../useFilter';
import EdsIcon from '../../icons/EdsIcon';
import useScopeFilterFacade from './useScopeFilterFacade';
import {
    FilterButton,
    FilterWrapper,
} from '../PunchListFilter/PunchListFilter';
import { SelectFieldsWrapper } from '../PunchListFilter/SelectFields';
import { ChecklistPreview } from '../../../typings/apiTypes';

type FilterProps = {
    setFilteredScope: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | undefined>
    >;
    scopeItems?: ChecklistPreview[];
    isPoScope?: boolean;
    isIpoScope?: boolean;
};

const ScopeFilter = ({
    setFilteredScope,
    scopeItems,
    isPoScope,
    isIpoScope,
}: FilterProps): JSX.Element => {
    const [filterCount, setFilterCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [signatureChosen, setSignatureChosen] = useState<string>('All');
    const {
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
    } = useScopeFilterFacade(setFilterCount, setFilteredScope, scopeItems);

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
                    <Label label="Signatures" />
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

                        {isIpoScope ? (
                            <NativeSelect
                                id="MCPackageSelect"
                                label="MCpkg"
                                defaultValue={
                                    filter.mcPkg
                                        ? mcPkgs?.find(
                                              (mcpkg) => mcpkg === filter.mcPkg
                                          )
                                        : ''
                                }
                                onChange={handleMcPkgChange}
                            >
                                <option key="Empty" value="">
                                    Select
                                </option>
                                {mcPkgs?.map((mcpkg) => (
                                    <option key={mcpkg} value={mcpkg}>
                                        {mcpkg}
                                    </option>
                                ))}
                            </NativeSelect>
                        ) : null}
                    </SelectFieldsWrapper>
                </div>
            ) : null}
        </FilterWrapper>
    );
};

export default ScopeFilter;
