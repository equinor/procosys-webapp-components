import React from 'react';
import styled from 'styled-components';
import { SHADOW } from '../style/GlobalStyles';
import { Card } from '@equinor/eds-core-react';
const { CardHeader, CardHeaderTitle } = Card;

export const CardWrapper = styled.article`
    & h3,
    label {
        margin: 0;
    }
    & h5 {
        margin: 12px 0;
    }
    margin-bottom: 16px;
    box-shadow: ${SHADOW};
    border-radius: 10px;
`;

type EdsCardProps = {
    title: string;
    icon?: JSX.Element;
    children: JSX.Element;
};

const EdsCard = ({ title, icon, children }: EdsCardProps): JSX.Element => {
    return (
        <CardWrapper>
            <Card>
                <CardHeader>
                    <CardHeaderTitle>
                        <h3>{title}</h3>
                    </CardHeaderTitle>
                    {icon ? icon : null}
                </CardHeader>
                <div>{children}</div>
            </Card>
        </CardWrapper>
    );
};

export default EdsCard;
