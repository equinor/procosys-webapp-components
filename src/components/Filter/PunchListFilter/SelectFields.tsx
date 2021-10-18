import { NativeSelect } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { Filter } from '../useFilter';

export const SelectFieldsWrapper = styled.form`
    & > div {
        margin-bottom: 16px;
    }
`;

type SelectFieldsProps = {
    filter: Filter;
    responsibles: string[] | undefined;
    handleResponsibleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    formTypes: string[] | undefined;
    handleFormTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isChecklistPunchList?: boolean;
    isPoPunchList?: boolean;
};

const SelectFields = ({
    filter,
    responsibles,
    handleResponsibleChange,
    formTypes,
    handleFormTypeChange,
    isChecklistPunchList,
    isPoPunchList,
}: SelectFieldsProps): JSX.Element => {
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

export default SelectFields;
