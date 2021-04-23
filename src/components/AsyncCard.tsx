import React from 'react';
import { AsyncStatus } from '../contexts/CommAppContext';
import SkeletonLoadingPage from './loading/SkeletonLoader';
import EdsCard from './EdsCard';

type AsyncCardProps = {
    fetchStatus: AsyncStatus;
    errorMessage: string;
    emptyContentMessage?: string;
    children: JSX.Element;
    cardTitle: string;
};

const AsyncCard = ({
    fetchStatus,
    errorMessage,
    emptyContentMessage,
    cardTitle,
    children,
}: AsyncCardProps): JSX.Element => {
    const content = (): JSX.Element => {
        if (fetchStatus === AsyncStatus.SUCCESS) {
            return children;
        } else if (fetchStatus === AsyncStatus.EMPTY_RESPONSE) {
            return <p>{emptyContentMessage}</p>;
        } else if (fetchStatus === AsyncStatus.ERROR) {
            return <p>{errorMessage}</p>;
        } else {
            return <SkeletonLoadingPage nrOfRows={3} adjustableHeight={true} />;
        }
    };

    return <EdsCard title={cardTitle}>{content()}</EdsCard>;
};

export default AsyncCard;
