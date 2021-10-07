import { List } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../components/icons/EdsIcon';
import { LoopTag } from '../services/apiTypes';
import { Caption, COLORS } from '../style/GlobalStyles';

const LoopTagWrapper = styled.div`
    padding: 0 4%;
    background-color: #deecee;
    padding-bottom: 16px;
    & p {
        margin: 0;
        margin-bottom: 4px;
    }
    & button {
        & p {
            color: ${COLORS.mossGreen};
            display: flex;
            align-items: center;
        }
    }
`;

type LoopTagsProps = {
    loopTags: LoopTag[];
};

const LoopTags = ({ loopTags }: LoopTagsProps): JSX.Element => {
    const [showMore, setShowMore] = useState(false);

    const handleShowMoreClick = (): void => {
        setShowMore(true);
    };

    const handleShowLessClick = (): void => {
        setShowMore(false);
    };

    return (
        <LoopTagWrapper>
            <Caption>Loop tags:</Caption>
            <List>
                {loopTags
                    .slice(0, showMore ? loopTags.length : 3)
                    .map((loopTag) => (
                        <List.Item key={loopTag.tagId}>
                            <Caption>{loopTag.tagNo}</Caption>
                        </List.Item>
                    ))}
            </List>
            <button
                onClick={showMore ? handleShowLessClick : handleShowMoreClick}
            >
                <Caption>
                    {showMore ? 'Show less' : `Show all (${loopTags.length})`}
                    <EdsIcon
                        name={showMore ? 'chevron_down' : 'chevron_right'}
                        size={16}
                    />
                </Caption>
            </button>
        </LoopTagWrapper>
    );
};

export default LoopTags;
