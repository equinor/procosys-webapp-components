import React from 'react';
import styled from 'styled-components';

export const TagInfoWrapper = styled.main`
    min-height: calc(100vh - 203px);
    margin-bottom: 66px;
    box-sizing: border-box;
    padding: 16px 4%;
`;

const isValidValue = (value: string | null): boolean => {
    if (typeof value === 'string' && value.length > 0) return true;
    return false;
};

type AdditionalFieldRowProps = {
    label: string;
    value: string | null;
    unit: string | null;
    key: number;
};

const AdditionalFieldRow = ({
    label,
    value,
    unit,
    key,
}: AdditionalFieldRowProps): JSX.Element => {
    return (
        <TagInfoWrapper key={key}>
            <label>{label}</label>
            <p>
                {isValidValue(value) ? value : '-'}
                {isValidValue(value) && isValidValue(unit) ? unit : ''}
            </p>
        </TagInfoWrapper>
    );
};

export default AdditionalFieldRow;
