import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

export const TagInfoWrapper = styled.main`
    min-height: calc(100vh - 203px);
    margin-bottom: 66px;
    box-sizing: border-box;
    padding: 16px 4%;
`;

// type InfoRowProps = {
//     label: string;
//     value: string | null | undefined;
//     code?: string | null;
// };

const isValidValue = (value: string | null): boolean => {
    if (typeof value === 'string' && value.length > 0) return true;
    return false;
};

const AdditionalFieldRow = (
    label: string,
    value: string | null,
    unit: string | null,
    key: number
): JSX.Element => {
    return (
        <TagInfoWrapper key={key}>
            <label>{label}</label>
            <p>
                {isValidValue(value) ? value : '-'}{' '}
                {isValidValue(value) && isValidValue(unit) ? unit : ''}
            </p>
        </TagInfoWrapper>
    );
};

export default AdditionalFieldRow;
