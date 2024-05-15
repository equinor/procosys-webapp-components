import { Button, Progress, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Caption, COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../icons/EdsIcon';
import Markdown from "markdown-to-jsx";

const EntityDetailsWrapper = styled.article<{
    isDetailsCard?: boolean;
    isClickable?: boolean;
}>`
    cursor: ${(props): string => (props.isClickable ? 'pointer' : 'default')};
    display: flex;
    border-top: 1px solid ${COLORS.lightGrey};
    padding: 16px 4%;
    margin: 0;
    text-decoration: none;
    background-color: ${(props): string =>
        props.isDetailsCard ? COLORS.fadedBlue : COLORS.white};
    &:hover {
        opacity: ${(props): number => (props.isClickable ? 0.7 : 1)};
    }
`;

const IconWrapper = styled.div`
    padding-top: 3px;
    margin-right: 16px;
`;

const ContentWrapper = styled.div`
    flex-direction: column;
    word-break: break-word;
    width: 100%;
    & > p {
        margin: 0;
    }
`;

const HeaderWrapper = styled.div<{ isDetailsCard?: boolean }>`
    display: flex;
    align-items: baseline;
    & > h6 {
        margin: 0;
        color: ${(props): string =>
            props.isDetailsCard ? COLORS.black : COLORS.mossGreen};
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
    }
`;

const BookmarkWrapper = styled.div`
    margin-top: -15px;
`;

type EntityDetailsProps = {
    headerText: string;
    icon?: JSX.Element;
    description?: string;
    details?: string[];
    isDetailsCard?: boolean;
    onClick?: () => void;
    isBookmarked?: boolean;
    offlinePlanningState?: boolean;
    handleBookmarkClicked?: () => Promise<void>;
};

const EntityDetails = ({
    headerText,
    icon,
    description,
    details,
    isDetailsCard,
    onClick,
    isBookmarked,
    offlinePlanningState,
    handleBookmarkClicked,
}: EntityDetailsProps): JSX.Element => {
    const [loadingBookmark, setLoadingBookmark] = useState<boolean>(false);

    useEffect(() => {
        setLoadingBookmark(false);
    }, [isBookmarked]);

    return (
        <EntityDetailsWrapper
            isDetailsCard={isDetailsCard}
            isClickable={onClick ? true : false}
            onClick={onClick}
            role={isDetailsCard ? 'heading' : 'link'}
        >
            {icon ? <IconWrapper>{icon}</IconWrapper> : <></>}
            <ContentWrapper>
                <HeaderWrapper isDetailsCard={isDetailsCard}>
                    <h6>{headerText}</h6>
                    {details?.map((detail, index) => (
                        <Caption key={`${index}-${detail}`}>{detail}</Caption>
                    ))}
                </HeaderWrapper>
                {description ? 
                    <Typography variant="caption" lines={2}>
                        <Markdown>{description}</Markdown>
                    </Typography>
                 : null}
            </ContentWrapper>
            {offlinePlanningState && handleBookmarkClicked && (
                <BookmarkWrapper>
                    <Button
                        variant="ghost_icon"
                        onClick={(e: React.MouseEvent<HTMLElement>): void => {
                            e.stopPropagation();
                            setLoadingBookmark(true);
                            handleBookmarkClicked();
                        }}
                    >
                        {loadingBookmark ? (
                            <Progress.Circular size={16} />
                        ) : (
                            <EdsIcon
                                color={COLORS.mossGreen}
                                name={
                                    isBookmarked
                                        ? 'bookmark_filled'
                                        : 'bookmark_outlined'
                                }
                            />
                        )}
                    </Button>
                </BookmarkWrapper>
            )}
        </EntityDetailsWrapper>
    );
};

export default EntityDetails;
