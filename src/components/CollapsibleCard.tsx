import React from 'react';
import { Accordion } from '@equinor/eds-core-react';

type CollapsibleCardProps = {
    children: JSX.Element | JSX.Element[];
    cardTitle: string;
    expanded?: boolean;
    chevronPosition?: 'left' | 'right';
};

const CollapsibleCard = ({
    cardTitle,
    children,
    expanded = true,
    chevronPosition = 'left',
}: CollapsibleCardProps): JSX.Element => {
    const click = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
    };

    return (
        <Accordion
            onClick={click}
            headerLevel="h3"
            chevronPosition={chevronPosition}
        >
            <Accordion.Item isExpanded={expanded}>
                <Accordion.Header>{cardTitle}</Accordion.Header>
                <Accordion.Panel>{children}</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};

export default CollapsibleCard;
