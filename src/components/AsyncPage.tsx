import { Banner } from '@equinor/eds-core-react';
import React from 'react';
import { COLORS } from '../style/GlobalStyles';
import { AsyncStatus } from '../typings/enums';
import EdsIcon from './icons/EdsIcon';
import SkeletonLoadingPage from './loading/SkeletonLoader';

type AsyncPageProps = {
    fetchStatus: AsyncStatus;
    errorMessage: string;
    emptyContentMessage?: string;
    children: JSX.Element | JSX.Element[];
    loadingMessage?: string;
};

const AsyncPage = ({
    fetchStatus,
    errorMessage,
    emptyContentMessage,
    children,
    loadingMessage,
}: AsyncPageProps): JSX.Element => {
    const content = (): JSX.Element => {
        if (fetchStatus === AsyncStatus.SUCCESS) {
            return <>{children}</>;
        } else if (fetchStatus === AsyncStatus.EMPTY_RESPONSE) {
            return (
                <Banner>
                    <Banner.Icon>
                        <EdsIcon
                            name={'info_circle'}
                            color={COLORS.mossGreen}
                        />
                    </Banner.Icon>
                    <Banner.Message role={'paragraph'}>
                        {emptyContentMessage ? emptyContentMessage : ''}
                    </Banner.Message>
                </Banner>
            );
        } else if (fetchStatus === AsyncStatus.ERROR) {
            return (
                <Banner>
                    <Banner.Icon variant="warning">
                        <EdsIcon name={'error_filled'} color={COLORS.danger} />
                    </Banner.Icon>
                    <Banner.Message>{errorMessage}</Banner.Message>
                </Banner>
            );
        } else {
            return <SkeletonLoadingPage nrOfRows={10} text={loadingMessage} />;
        }
    };

    return <div>{content()}</div>;
};

export default AsyncPage;
