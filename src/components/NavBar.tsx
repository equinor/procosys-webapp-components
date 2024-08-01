import { Button, Typography } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { BREAKPOINT, COLORS } from '../style/GlobalStyles';
import EdsIcon from './icons/EdsIcon';

const NavbarWrapper = styled.nav<{ noBorder: boolean; isOffline: boolean, testColor: boolean }>`
    height: 54px;
    width: 100%;
    max-width: 768px;
    background-color: ${({ isOffline, testColor }): string =>
        testColor ? '#FFFF5C' : (isOffline ? `${COLORS.midnight}` : `${COLORS.white}`)};
    border-bottom: ${({ noBorder }): string =>
        noBorder ? 'none' : `1px solid ${COLORS.fadedBlue}`};
    display: flex;
    flex-grow: 100;
    color: ${({ isOffline }): string =>
        isOffline ? `${COLORS.moss}` : `${COLORS.mossGreen}`};
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
    & > span {
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: center;
    }
    & > div {
        width: 48px;
    }
`;

export const NavButton = styled(Button)`
    color: inherit;
`;

type NavbarProps = {
    leftContent?: JSX.Element;
    midContent?: string;
    rightContent?: JSX.Element;
    noBorder?: boolean;
    isOffline?: boolean;
    testColor?: boolean;
};

const Navbar = ({
    leftContent,
    midContent = '',
    rightContent,
    noBorder = false,
    isOffline = false,
    testColor = false,
}: NavbarProps): JSX.Element => {
    return (
        <>
            <NavbarWrapper noBorder={noBorder} isOffline={isOffline} testColor={testColor}>
                {leftContent}
                <span>
                    {isOffline && (
                        <EdsIcon
                            name={'wifi_off'}
                            title={'wifi_off'}
                            size={24}
                            color={COLORS.white}
                        />
                    )}{' '}
                    <Typography
                        variant="h4"
                        color={isOffline ? COLORS.white : ''}
                    >
                        {midContent}
                    </Typography>
                </span>

                {rightContent ? rightContent : <div> </div>}
            </NavbarWrapper>
        </>
    );
};

export default Navbar;
