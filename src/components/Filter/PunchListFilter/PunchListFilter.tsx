import React, { useState } from 'react';
import { Label, Radio } from '@equinor/eds-core-react';
import { CompletionStatus, PunchPreview } from '../../../services/apiTypes';
import { Signatures } from '../useFilter';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';
import EdsIcon from '../../icons/EdsIcon';
import usePunchListFilterFacade from './usePunchListFilterFacade';
import SelectFields from './SelectFields';

export const FilterWrapper = styled.div`
    padding: 0 4%;
    width: 100%;
    box-sizing: border-box;
`;

export const FilterButton = styled.div<{ isActive: boolean }>`
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
    const statusList = [
        `All`,
        `${CompletionStatus.PA}`,
        `${CompletionStatus.PB}`,
    ];

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
                        {statusList.map((status) => (
                            <Radio
                                key={status}
                                label={status}
                                checked={statusChosen === status}
                                onChange={(): void => {
                                    handleStatusChange(status);
                                    setStatusChosen(status);
                                }}
                            />
                        ))}
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
                    <SelectFields
                        filter={filter}
                        responsibles={responsibles}
                        handleResponsibleChange={handleResponsibleChange}
                        formTypes={formTypes}
                        handleFormTypeChange={handleFormTypeChange}
                        isChecklistPunchList={isChecklistPunchList}
                        isPoPunchList={isPoPunchList}
                    />
                </div>
            ) : null}
        </FilterWrapper>
    );
};

export default PunchListFilter;
