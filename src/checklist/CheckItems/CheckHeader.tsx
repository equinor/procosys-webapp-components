import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';

const CheckHeaderWrapper = styled.div<{ noBorder?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 48px;
    padding-bottom: 12px;
    border-bottom: ${(props): string =>
        props.noBorder ? 'none' : `2px solid ${COLORS.fadedBlue}`};
    & div {
        flex: 0 0 95px;
        padding-right: 6px;
        display: flex;
        justify-content: space-around;
    }
    & h4 {
        margin: 0;
    }
`;

const GreyText = styled.p`
    margin: 0;
    color: ${COLORS.darkGrey};
`;

type CheckHeaderProps = {
    text: string;
    removeLabels?: boolean;
};

const CheckHeader = ({ text, removeLabels }: CheckHeaderProps): JSX.Element => {
    return (
        <CheckHeaderWrapper noBorder={removeLabels}>
            <h4>{text}</h4>
            <div>
                <GreyText>{!removeLabels && 'Check'}</GreyText>
                <GreyText>{!removeLabels && 'NA'}</GreyText>
            </div>
        </CheckHeaderWrapper>
    );
};

export default CheckHeader;
