import React, { useState } from 'react';
import { Checkbox, Label, NativeSelect, Radio } from '@equinor/eds-core-react';
import {
    ChecklistPreview,
    CompletionStatus,
    PunchPreview,
} from '../../services/apiTypes';
import useFilterFacade, { Signatures } from './useFilterFacade';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../icons/EdsIcon';

const FilterWrapper = styled.div`
    padding: 0 4%;
    width: 100%;
    box-sizing: border-box;
`;

const FilterButton = styled.div<{ isActive: boolean }>`
    display: flex;
    justify-content: flex-end;
    margin: 16px 0 0 0;
    color: ${(props): string =>
        props.isActive ? COLORS.danger : COLORS.mossGreen};
    & > p {
        margin: 0;
        color: ${(props): string =>
            props.isActive ? COLORS.danger : COLORS.mossGreen};
    }
`;

const SelectFieldsWrapper = styled.form`
    & > div {
        margin-bottom: 16px;
    }
`;

type FilterProps = {
    url: string;
    setShownScope?: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | undefined>
    >;
    setShownPunches?: React.Dispatch<
        React.SetStateAction<PunchPreview[] | undefined>
    >;
    scopeItems?: ChecklistPreview[];
    punchItems?: PunchPreview[];
    isChecklistPunchList?: boolean;
};

const Filter = ({
    url,
    setShownScope,
    setShownPunches,
    scopeItems,
    punchItems,
    isChecklistPunchList,
}: FilterProps): JSX.Element => {
    const [filterCount, setFilterCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [statusChosen, setStatusChosen] = useState<string>('All');
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
    } = useFilterFacade(
        setFilterCount,
        setShownScope,
        setShownPunches,
        scopeItems,
        punchItems
    );

    const determineStatusFieldsToRender = (): JSX.Element => {
        if (url.includes('/punch-list')) {
            return (
                <div>
                    <Radio
                        label={'All'}
                        checked={statusChosen === 'All'}
                        onChange={(): void => {
                            handleStatusChange('All');
                            setStatusChosen('All');
                        }}
                    />
                    <Radio
                        label={CompletionStatus.PA}
                        checked={statusChosen === CompletionStatus.PA}
                        onChange={(): void => {
                            handleStatusChange(CompletionStatus.PA);
                            setStatusChosen(CompletionStatus.PA);
                        }}
                    />
                    <Radio
                        label={CompletionStatus.PB}
                        checked={statusChosen === CompletionStatus.PB}
                        onChange={(): void => {
                            handleStatusChange(CompletionStatus.PB);
                            setStatusChosen(CompletionStatus.PB);
                        }}
                    />
                </div>
            );
        } else {
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
        }
    };

    const determineSignatureFieldsToRender = (): JSX.Element => {
        if (url.includes('/punch-list')) {
            return (
                <>
                    <Radio
                        label={Signatures.NOT_CLEARED}
                        checked={signatureChosen === Signatures.NOT_CLEARED}
                        onChange={(): void => {
                            handleSignatureChange(Signatures.NOT_CLEARED);
                            setSignatureChosen(Signatures.NOT_CLEARED);
                        }}
                    />
                    <Radio
                        label={Signatures.CLEARED}
                        checked={signatureChosen === Signatures.CLEARED}
                        onChange={(): void => {
                            handleSignatureChange(Signatures.CLEARED);
                            setSignatureChosen(Signatures.CLEARED);
                        }}
                    />
                </>
            );
        } else {
            return (
                <>
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
        }
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
                    {isOpen ? 'Hide' : 'Show'} filter{' '}
                    {filterCount > 0 ? `(${filterCount})` : ''}
                </p>
                <EdsIcon name={isOpen ? 'chevron_up' : 'chevron_down'} />
            </FilterButton>
            {isOpen ? (
                <div>
                    <Label label="Status" />
                    {determineStatusFieldsToRender()}
                    <Label label="Signatures" />
                    <Radio
                        label="All"
                        checked={signatureChosen === 'All'}
                        onChange={(): void => {
                            handleSignatureChange('');
                            setSignatureChosen('All');
                        }}
                    />
                    {determineSignatureFieldsToRender()}
                    {isChecklistPunchList ? null : (
                        <SelectFieldsWrapper>
                            <NativeSelect
                                id="ResponsibleSelect"
                                label="Responsible"
                                defaultValue={
                                    filter.responsible
                                        ? responsibles?.find(
                                              (responsible) =>
                                                  responsible ===
                                                  filter.responsible
                                          )
                                        : ''
                                }
                                onChange={handleResponsibleChange}
                            >
                                <option key="Empty" value="">
                                    Select
                                </option>
                                {responsibles?.map((responsible) => (
                                    <option
                                        key={responsible}
                                        value={responsible}
                                    >
                                        {responsible}
                                    </option>
                                ))}
                            </NativeSelect>
                            {url.includes('/PO') ? null : (
                                <NativeSelect
                                    id="FormTypeSelect"
                                    label="Form type"
                                    defaultValue={
                                        filter.formType
                                            ? formTypes?.find(
                                                  (formType) =>
                                                      formType ===
                                                      filter.formType
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
                    )}
                </div>
            ) : null}
        </FilterWrapper>
    );
};

export default Filter;
