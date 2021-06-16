import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../style/GlobalStyles';

const StatusColumnWrapper = styled.div`
    width: 24px;
    box-sizing: border-box;
    & > img {
        width: 24px;
        object-fit: contain;
    }
`;

const StatusLettersWrapper = styled.div`
    background-color: ${COLORS.greyBackground};
    width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > p {
        display: inline;
        font-size: 12px;
        font-weight: 500;
        margin: 1px 1.5px -3px 1.5px;
    }
`;

export type StatusLetters = ['C' | 'S' | null, 'V' | 'O' | null];

type StatusColumnProps = {
    statusIcon: JSX.Element;
    statusLetters: StatusLetters;
};

const StatusColumn = ({
    statusIcon,
    statusLetters,
}: StatusColumnProps): JSX.Element => {
    return (
        <StatusColumnWrapper>
            {statusIcon}
            <StatusLettersWrapper>
                {statusLetters[0] ? <p>{statusLetters[0]}</p> : null}
                {statusLetters[1] ? <p>{statusLetters[1]}</p> : null}
            </StatusLettersWrapper>
        </StatusColumnWrapper>
    );
};

export default StatusColumn;
