import { Chip, Typography } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import CompletionStatusIcon from '../icons/CompletionStatusIcon';
import EdsIcon from '../icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import { CompletionStatus } from '../../typings/enums';
import StatusColumn, { StatusLetters } from './StatusColumn';

const InfoItemWrapper = styled.div<{
    isDetailsCard?: boolean;
    isScope?: boolean;
}>`
    background-color: ${(props): string =>
        props.isDetailsCard ? COLORS.fadedBlue : COLORS.white};
    cursor: ${(props): string => (props.isDetailsCard ? 'none' : 'pointer')};
    width: 100%;
    padding: 12px 4% 12px 4%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 24px auto 1fr;
    grid-template-rows: auto auto;
    gap: 0px 12px;
    grid-template-areas:
        'status-wrapper header chips'
        'status-wrapper description description';
    @media (max-width: ${(props): string =>
            props.isScope ? '350px' : '400px'}) {
        grid-template-areas:
            'status-wrapper header'
            'status-wrapper description'
            'status-wrapper chips';
    }
`;

const StatusWrapper = styled.div`
    width: 24px;
    padding-top: 3px;
    margin-right: 16px;
    grid-area: status-wrapper;
`;

const ChipsWrapper = styled.div<{ isScope?: boolean }>`
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    grid-area: chips;
    & > div {
        z-index: 0;
        color: ${COLORS.black};
    }
    & > div:not(:first-child) {
        margin-left: 4px;
    }
    @media (max-width: ${(props): string =>
            props.isScope ? '350px' : '400px'}) {
        justify-content: flex-start;
        & > div {
            margin-top: 4px;
        }
    }
`;

const HeaderWrapper = styled.div`
    grid-area: header;
    & > h6 {
        margin: 0;
        color: ${COLORS.mossGreen};
    }
`;

const DescriptionWrapper = styled.div`
    & > p {
        margin: 0;
    }
    grid-area: description;
`;

type InfoItemProps = {
    isScope?: boolean;
    isDetailsCard?: boolean;
    status: CompletionStatus;
    statusLetters: StatusLetters;
    headerText: string;
    description: string;
    tag?: string;
    chips?: string[];
    attachments?: number;
    onClick?: () => void;
};

const InfoItem = (props: InfoItemProps): JSX.Element => {
    return (
        <InfoItemWrapper
            isScope={props.isScope}
            isDetailsCard={props.isDetailsCard}
            onClick={props.onClick}
            role={props.isDetailsCard ? 'heading' : 'button'}
        >
            <StatusWrapper>
                <StatusColumn
                    statusIcon={<CompletionStatusIcon status={props.status} />}
                    statusLetters={props.statusLetters}
                />
            </StatusWrapper>
            <HeaderWrapper>
                <h6>{props.headerText}</h6>
            </HeaderWrapper>
            <ChipsWrapper isScope={props.isScope}>
                {props.tag ? (
                    <Chip>
                        <EdsIcon name={'tag'} color={'black'} />
                        {props.tag}
                    </Chip>
                ) : null}
                {props.chips?.map((item) => {
                    return item ? <Chip key={item}>{item}</Chip> : null;
                })}
                {props.attachments ? (
                    <Chip>
                        <EdsIcon name={'attachment'} color={'black'} />
                        {props.attachments}
                    </Chip>
                ) : null}
            </ChipsWrapper>
            <DescriptionWrapper>
                <Typography lines={2}>{props.description}</Typography>
            </DescriptionWrapper>
        </InfoItemWrapper>
    );
};

export default InfoItem;
