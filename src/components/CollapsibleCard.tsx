import React from 'react';
import { Accordion } from '@equinor/eds-core-react';
import styled from 'styled-components';

const AccordionWrapper = styled.div`
    margin-bottom: 16px;
`;

type CollapsibleCardProps = {
    children: JSX.Element | JSX.Element[];
    cardTitle: string;
};

const CollapsibleCard = ({
    cardTitle,
    children,
}: CollapsibleCardProps): JSX.Element => {
    return (
        <AccordionWrapper>
            <Accordion headerLevel="h3" chevronPosition="left">
                <Accordion.Item isExpanded={true}>
                    <Accordion.Header>{cardTitle}</Accordion.Header>
                    <Accordion.Panel>{children}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </AccordionWrapper>
    );
};

export default CollapsibleCard;
