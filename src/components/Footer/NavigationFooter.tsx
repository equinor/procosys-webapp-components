import { DotProgress } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../typings/enums';
import NavigationFooterShell, {
    NavigationFooterBase,
} from './NavigationFooterShell';

const NavigationFooterWrapper = styled(NavigationFooterBase)`
    justify-content: space-evenly;
`;

type NavigationFooterProps = {
    children: JSX.Element | JSX.Element[];
    footerStatus?: AsyncStatus;
};

const NavigationFooter = ({
    children,
    footerStatus,
}: NavigationFooterProps): JSX.Element => {
    if (
        footerStatus === AsyncStatus.SUCCESS ||
        footerStatus === AsyncStatus.EMPTY_RESPONSE ||
        footerStatus === undefined
    ) {
        return <NavigationFooterWrapper>{children}</NavigationFooterWrapper>;
    } else if (footerStatus === AsyncStatus.ERROR) {
        return (
            <NavigationFooterShell>
                <p>Unable to load footer. Please reload</p>
            </NavigationFooterShell>
        );
    } else {
        return (
            <NavigationFooterShell>
                <DotProgress color="primary" />
            </NavigationFooterShell>
        );
    }
};

export default NavigationFooter;
