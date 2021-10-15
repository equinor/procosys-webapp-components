import { List } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Caption, COLORS } from '../../style/GlobalStyles';
import ShowMoreButton from '../../components/buttons/ShowMoreButton';
import { LoopTag } from '../../typings/apiTypes';

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
                toggleShowMore={setShowMore}
                showCondition={showMore}
                showText={`Show all (${loopTags.length})`}
                hideText={'Show less'}
            />
        </LoopTagWrapper>
    );
};

export default LoopTags;
