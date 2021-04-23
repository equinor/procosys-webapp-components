import { Card } from '@equinor/eds-core-react';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const SkeletonLoadingPageWrapper = styled.div<{ adjustableHeight?: boolean }>`
    padding: 24px 0;
    min-height: ${(props): string =>
        props.adjustableHeight ? 'auto' : '92vh'};
    & h3 {
        margin: 0;
        text-align: center;
    }
`;

const load = keyframes`
    from {
        left: -150px;
    }
    to   {
        left: 100%;
    }
`;

const BaseSkeleton = styled(Card)`
    box-sizing: border-box;
    border-radius: 10px;
    background-color: #eeeeee;
    position: relative;
    overflow: hidden;
    margin: 20px;
    ::before {
        content: '';
        display: block;
        position: absolute;
        left: -150px;
        top: 0;
        height: 100%;
        width: 50%;
        background: linear-gradient(
            to right,
            #eeeeee 0%,
            #e6e6e6 50%,
            #eeeeee 100%
        );
        animation: ${load} 1s cubic-bezier(0.1, 0, 0.2, 1) infinite;
    }
`;

const SkeletonRow = styled(BaseSkeleton)<{ fullWidth: boolean }>`
    width: ${(props): string => (props.fullWidth ? '100%' : '92%')};
    height: 50px;
    margin: 15px auto 15px auto;
`;

type SkeletonLoadingPageProps = {
    text?: string;
    fullWidth?: boolean;
    adjustableHeight?: boolean;
    nrOfRows?: number;
};

const SkeletonLoadingPage = ({
    text,
    fullWidth,
    nrOfRows = 10,
    adjustableHeight,
}: SkeletonLoadingPageProps): JSX.Element => {
    const SkeletonRowsToRender: JSX.Element[] = [];

    for (let i = 0; i < nrOfRows; i++) {
        SkeletonRowsToRender.push(
            i === 0 ? (
                <SkeletonRow
                    data-testid="skeleton-row"
                    key={i}
                    fullWidth={fullWidth ? true : false}
                />
            ) : (
                <SkeletonRow key={i} fullWidth={fullWidth ? true : false} />
            )
        );
    }

    return (
        <SkeletonLoadingPageWrapper adjustableHeight={adjustableHeight}>
            {text && <h3>{text}</h3>}
            {SkeletonRowsToRender}
        </SkeletonLoadingPageWrapper>
    );
};

export default SkeletonLoadingPage;
