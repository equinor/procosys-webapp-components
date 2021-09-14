import React, { useState } from 'react';
import { Label, NativeSelect, Radio } from '@equinor/eds-core-react';
import { CompletionStatus, PunchPreview } from '../../../services/apiTypes';
import { Signatures } from '../useFilter';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';
import EdsIcon from '../../icons/EdsIcon';
import usePunchListFilterFacade from './usePunchListFilterFacade';

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
    setShownPunches: React.Dispatch<
        React.SetStateAction<PunchPreview[] | undefined>
    >;
    punchItems?: PunchPreview[];
    isChecklistPunchList?: boolean;
    isPoPunchList?: boolean;
};

const PunchListFilter = ({
    setShownPunches,
    punchItems,
    isChecklistPunchList,
    isPoPunchList,
}: FilterProps): JSX.Element => {
    const [filterCount, setFilterCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [statusChosen, setStatusChosen] = useState<string>('All');
    const [signatureChosen, setSignatureChosen] = useState<string>('All');
    const {
        filter,
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    } = usePunchListFilterFacade(setFilterCount, setShownPunches, punchItems);

    const getStatusFieldsToRender = (): JSX.Element => {
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
    };

    const getSignatureFieldsToRender = (): JSX.Element => {
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
    };

    const determineSelectFieldsToRender = (): JSX.Element => {
        if (isChecklistPunchList) return <></>;
        return (
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
                {isPoPunchList ? null : (
                    <NativeSelect
                        id="FormTypeSelect"
                        label="Form type"
                        defaultValue={
                            filter.formType
                                ? formTypes?.find(
                                      (formType) => formType === filter.formType
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
                    {isOpen ? 'Hide' : 'Show'} filter{' '}
                    {filterCount > 0 ? `(${filterCount})` : ''}
                </p>
                <EdsIcon name={isOpen ? 'chevron_up' : 'chevron_down'} />
            </FilterButton>
            {isOpen ? (
                <div>
                    <Label label="Status" />
                    {getStatusFieldsToRender()}
                    <Label label="Signatures" />
                    {getSignatureFieldsToRender()}
                    {determineSelectFieldsToRender()}
                </div>
            ) : null}
        </FilterWrapper>
    );
};

export default PunchListFilter;
