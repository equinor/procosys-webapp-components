import { Banner } from '@equinor/eds-core-react';
import React from 'react';
import { AsyncStatus } from '../contexts/CommAppContext';
import { COLORS } from '../style/GlobalStyles';
import EdsIcon from './icons/EdsIcon';
import SkeletonLoadingPage from './loading/SkeletonLoader';
const { BannerIcon, BannerMessage } = Banner;

type AsyncPageProps = {
    fetchStatus: AsyncStatus;
    errorMessage: string;
    emptyContentMessage?: string;
    children: JSX.Element;
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
                    <BannerIcon>
                        <EdsIcon
                            name={'info_circle'}
                            color={COLORS.mossGreen}
                        />
                    </BannerIcon>
                    <BannerMessage role={'paragraph'}>
                        {emptyContentMessage ? emptyContentMessage : ''}
                    </BannerMessage>
                </Banner>
            );
        } else if (fetchStatus === AsyncStatus.ERROR) {
            return (
                <Banner>
                    <BannerIcon variant="warning">
                        <EdsIcon name={'error_filled'} color={COLORS.danger} />
                    </BannerIcon>
                    <BannerMessage>{errorMessage}</BannerMessage>
                </Banner>
            );
        } else {
            return <SkeletonLoadingPage nrOfRows={10} text={loadingMessage} />;
        }
    };

    return <div>{content()}</div>;
};

export default AsyncPage;
