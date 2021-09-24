import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../style/GlobalStyles';

const FooterButtonWrapper = styled.button<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    border: none;
    cursor: pointer;
    padding: 12px 0 10px 0;
    margin: 0;
    background-color: ${({ active }): string =>
        active ? COLORS.fadedBlue : COLORS.white};
    position: relative;
    & p {
        margin: 0;
    }
`;

const ItemCount = styled.span<{ active: boolean }>`
    position: absolute;
    top: 8px;
    left: calc(50% + 7px);
    background-color: ${({ active }): string =>
        active ? COLORS.mossGreen : COLORS.fadedBlue};
    border-radius: 15px;
    min-width: 16px;
    padding: 4px 5px 1px 5px;
    margin: 0;
    & p {
        text-align: center;
        font-size: 12px;
        color: ${({ active }): string =>
            active ? COLORS.white : COLORS.black};
        border: none;
    }
`;

type FooterButtonProps = {
    active: boolean;
    goTo: () => void;
    numberOfItems?: number;
    icon: JSX.Element;
    label: string;
};

const FooterButton = ({
    active,
    goTo,
    numberOfItems,
    icon,
    label,
}: FooterButtonProps): JSX.Element => {
    return (
        <FooterButtonWrapper active={active} onClick={goTo}>
            {icon}
            <p>{label}</p>
            {numberOfItems ? (
                <ItemCount active={active}>
                    <p>{numberOfItems}</p>
                </ItemCount>
            ) : null}
        </FooterButtonWrapper>
    );
};

export default FooterButton;
