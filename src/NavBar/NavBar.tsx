import React from 'react';
import styled from 'styled-components';
import { BREAKPOINT, COLORS } from '../style/GlobalStyles';

const NavbarWrapper = styled.nav<{ noBorder: boolean }>`
    height: 54px;
    width: 100%;
    max-width: 768px;
    background-color: ${COLORS.white};
    border-bottom: ${(props): string =>
        props.noBorder ? 'none' : `1px solid ${COLORS.fadedBlue}`};
    display: flex;
    flex-grow: 100;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 4px 28px;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    & img {
        width: 24px;
        height: 24px;
        transform: scale(1.3);
    }
    & > h4 {
        text-align: center;
        margin: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    & > button {
        padding: 0;
    }
    ${BREAKPOINT.standard} {
        padding: 4px 4%;
    }
`;

type NavbarProps = {
    leftContent?: JSX.Element;
    midContent?: string;
    rightContent?: JSX.Element;
    noBorder?: boolean;
};

const Navbar = ({
    leftContent,
    midContent = '',
    rightContent,
    noBorder = false,
}: NavbarProps): JSX.Element => {
    return (
        <>
            <NavbarWrapper noBorder={noBorder}>
                {leftContent}
                <h4>{midContent}</h4>
                {rightContent}
            </NavbarWrapper>
        </>
    );
};

export default Navbar;
