import React from 'react';
import SkeletonLoadingPage from './loading/SkeletonLoader';
import { Accordion } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { AsyncStatus } from '../typings/enums';

const AccordionWrapper = styled.div`
    margin-bottom: 16px;
`;

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

    return (
        <AccordionWrapper>
            <Accordion headerLevel="h3" chevronPosition="left">
                <Accordion.Item
                    isExpanded={fetchStatus !== AsyncStatus.LOADING}
                >
                    <Accordion.Header>{cardTitle}</Accordion.Header>

                    <Accordion.Panel>{content()}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </AccordionWrapper>
    );
};

export default AsyncCard;
