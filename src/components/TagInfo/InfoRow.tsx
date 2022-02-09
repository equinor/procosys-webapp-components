import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

const InfoRowWrapper = styled.div`
    & > p {
        margin: 0;
        margin-bottom: 12px;
    }
    & > label {
        color: ${COLORS.darkGrey};
    }
`;

type InfoRowProps = {
    label: string;
    value: string | null | undefined;
    code?: string | null;
};

const InfoRow = ({ label, value, code }: InfoRowProps): JSX.Element => {
    return (
        <InfoRowWrapper>
            <label>{label}</label>
            <p>
                {code ? `${code}, ` : ''}
                {value ?? '-'}
            </p>
        </InfoRowWrapper>
    );
};

export default InfoRow;
