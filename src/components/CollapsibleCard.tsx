import React from 'react';
import { Accordion } from '@equinor/eds-core-react';
import styled from 'styled-components';

const AccordionWrapper = styled.div`
    margin-bottom: 16px;
`;

type CollapsibleCardProps = {
    children: JSX.Element | JSX.Element[];
    cardTitle: string;
    expanded?: boolean;
};

const CollapsibleCard = ({
    cardTitle,
    children,
    expanded = true,
}: CollapsibleCardProps): JSX.Element => {
    const click = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
    };

    return (
        <AccordionWrapper>
            <Accordion onClick={click} headerLevel="h3" chevronPosition="left">
                <Accordion.Item isExpanded={expanded}>
                    <Accordion.Header>{cardTitle}</Accordion.Header>
                    <Accordion.Panel>{children}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </AccordionWrapper>
    );
};

export default CollapsibleCard;
