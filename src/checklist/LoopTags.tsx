import { List } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { LoopTag } from '../services/apiTypes';
import { Caption, COLORS } from '../style/GlobalStyles';
import ShowMoreButton from '../components/buttons/ShowMoreButton';

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

    const handleShowClick = (): void => {
        setShowMore(!showMore);
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
            <ShowMoreButton
                handleOnClick={(): void => handleShowClick()}
                showCondition={showMore}
                showText={`Show all (${loopTags.length})`}
                hideText={'Show less'}
            />
        </LoopTagWrapper>
    );
};

export default LoopTags;
