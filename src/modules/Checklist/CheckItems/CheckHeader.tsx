import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';

const CheckHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 32px;
    & div {
        flex: 0 0 95px;
        padding-right: 6px;
        display: flex;
        justify-content: space-around;
    }
    & h5 {
        margin: 0;
    }
`;

const GreyText = styled.p`
    margin: 0;
    color: ${COLORS.darkGrey};
`;

type CheckHeaderProps = {
    text: string;
    addLabels?: boolean;
};

const CheckHeader = ({ text, addLabels }: CheckHeaderProps): JSX.Element => {
    return (
        <CheckHeaderWrapper>
            <h5>{text}</h5>
            <div>
                <GreyText>{addLabels && 'Check'}</GreyText>
                <GreyText>{addLabels && 'NA'}</GreyText>
            </div>
        </CheckHeaderWrapper>
    );
};

export default CheckHeader;
