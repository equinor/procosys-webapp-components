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
    formTypes: string[] | undefined;
    mcPkgs: string[] | undefined;
    handleResponsibleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleFormTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleMcPkgChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isChecklistPunchList?: boolean;
    isPoPunchList?: boolean;
    isIpoPunchList?: boolean;
};

const SelectFields = ({
    filter,
    responsibles,
    formTypes,
    mcPkgs,
    handleResponsibleChange,
    handleFormTypeChange,
    handleMcPkgChange,
    isChecklistPunchList,
    isPoPunchList,
    isIpoPunchList,
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

            {isIpoPunchList ? (
                <NativeSelect
                    id="MCPackageSelect"
                    label="MCpkg"
                    defaultValue={
                        filter.mcPkg
                            ? mcPkgs?.find((mcpkg) => mcpkg === filter.mcPkg)
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
    );
};

export default SelectFields;
