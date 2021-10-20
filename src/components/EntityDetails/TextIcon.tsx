import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

const TextIconWrapper = styled.div<{ color: string }>`
    width: 24px;
    height: 24px;
    background-color: ${({ color }): string => color};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TextWrapper = styled.p`
    color: ${COLORS.white};
    font-weight: bold;
    font-size: 12px;
`;

type TextIconProps = {
    color: string;
    text: string;
};

const TextIcon = ({ color, text }: TextIconProps): JSX.Element => {
    return (
        <TextIconWrapper color={color}>
            <TextWrapper>{text}</TextWrapper>
        </TextIconWrapper>
    );
};

export default TextIcon;
