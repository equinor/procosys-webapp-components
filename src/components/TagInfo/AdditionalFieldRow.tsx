import React from 'react';
import styled from 'styled-components';
import { InfoRowWrapper } from './InfoRow';

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
        <InfoRowWrapper key={key}>
            <label>{label}</label>
            <p>
                {isValidValue(value) ? value : '-'}{' '}
                {isValidValue(value) && isValidValue(unit) ? unit : ''}
            </p>
        </InfoRowWrapper>
    );
};

export default AdditionalFieldRow;
