import React from 'react';
import styled from 'styled-components';
import CompletionStatusIcon from '../components/icons/CompletionStatusIcon';
import EdsIcon from '../components/icons/EdsIcon';
import { ChecklistDetails, ChecklistResponse } from '../services/apiTypes';
import { Caption, COLORS } from '../style/GlobalStyles';

const DetailsCardWrapper = styled.div`
    cursor: pointer;
    display: flex;
    background-color: #deecee;
    padding: 4% 20px;
    text-decoration: none;
    &:hover {
        opacity: 0.7;
    }
`;

const DetailsWrapper = styled.div`
    flex-direction: column;
    flex: 1;
    & > p {
        margin: 0;
    }
`;

const StatusImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 12px;
    align-self: center;
    & > img {
        height: 20px;
    }
`;

const StatusTextWrapper = styled.div`
    display: flex;
    & > p {
        margin: 0;
        background-color: ${COLORS.lightGrey};
        font-size: 0.75rem;
    }
`;

const DetailsHeaderWrapper = styled.div`
    display: flex;
    align-items: baseline;
    & > p:first-child {
        flex: 2;
        color: ${COLORS.mossGreen};
        text-align: left;
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
    }
`;

const DetailsBodyWrapper = styled.div`
    display: flex;
    margin: 0;
    & > div {
        margin-left: auto;
    }
    & p {
        margin: 0;
        margin-top: 4px;
    }
`;

type ScopeItemProps = {
    details: ChecklistDetails;
};

const ScopeItem = ({ details }: ScopeItemProps): JSX.Element => {
    return (
        <DetailsCardWrapper>
            <StatusImageWrapper>
                <CompletionStatusIcon status={details.status} />
                <StatusTextWrapper>
                    {details.signedAt ? <Caption>S</Caption> : null}
                    {details.verifiedByUser ? <Caption>V</Caption> : null}
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <DetailsHeaderWrapper>
                    <Caption>{details.tagNo}</Caption>
                    <Caption>{details.formularType}</Caption>
                    <Caption>{details.responsibleCode}</Caption>
                </DetailsHeaderWrapper>
                <DetailsBodyWrapper>
                    <Caption>{details.tagDescription}</Caption>
                </DetailsBodyWrapper>
            </DetailsWrapper>
        </DetailsCardWrapper>
    );
};

export default ScopeItem;
