import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APIComment } from '../../typings/apiTypes';
import { AsyncStatus } from '../../typings/enums';
import Comment from './Comment';

const CommentsWrapper = styled.div`
    justify-content: center;
`;

type CommentsProps = {
    commentList?: APIComment[];
    abortController?: AbortController;
};

const Comments = ({ commentList }: CommentsProps): JSX.Element => {
    if (commentList) {
        return (
            <CommentsWrapper>
                {commentList.map((comment) => (
                    <Comment key={comment.id} comment={comment}></Comment>
                ))}
            </CommentsWrapper>
        );
    } else {
        return <div></div>;
    }
};

export default Comments;
