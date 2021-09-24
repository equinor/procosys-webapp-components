import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../style/GlobalStyles';

export const NavigationFooterBase = styled.div`
    width: 100%;
    max-width: 768px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
`;

const NavigationFooterShellWrapper = styled(NavigationFooterBase)`
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.white};
    height: 66px;
`;

type NavigationFooterShellProps = {
    children: React.ReactNode;
};

const NavigationFooterShell = ({
    children,
}: NavigationFooterShellProps): JSX.Element => {
    return (
        <NavigationFooterShellWrapper>{children}</NavigationFooterShellWrapper>
    );
};

export default NavigationFooterShell;
