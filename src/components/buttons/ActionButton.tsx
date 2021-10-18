import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';

const ActionButtonWrapper = styled.li`
    display: flex;
    align-items: center;
    width: 100%;
    height: 54px;
    box-sizing: border-box;
    cursor: pointer;
    list-style-type: none;
`;

const IconWrapper = styled.div`
    margin: 0 12px;
`;

const TextWrapper = styled.div``;

type ActionButtonProps = {
    icon: JSX.Element;
    label: string;
    onClick: () => void;
};

const ActionButton = ({
    icon,
    label,
    onClick,
}: ActionButtonProps): JSX.Element => {
    return (
        <ActionButtonWrapper
            role={'button'}
            aria-label={label}
            onClick={onClick}
        >
            <IconWrapper>{icon}</IconWrapper>
            <TextWrapper>
                <Typography group="navigation" variant="menu_title" as="span">
                    {label}
                </Typography>
            </TextWrapper>
        </ActionButtonWrapper>
    );
};

export default ActionButton;
