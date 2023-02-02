import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APIComment } from '../../typings/apiTypes';
import Comment from './Comment';

const CommentsWrapper = styled.div`
    justify-content: center;
`;

type CommentsProps = {
    getComments: (abortSignal?: AbortSignal) => Promise<APIComment[]>;
    abortController?: AbortController;
};

const Comments = (props: CommentsProps): JSX.Element => {
    const [comments, setComments] = useState<APIComment[]>([]);
    const [refreshComments, setRefreshComments] = useState(false);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const commentsFromApi = await props.getComments();
                setComments(commentsFromApi);
                console.log(comments);
            } catch (error) {
                console.log(error);
            }
        })();
        return (): void => props.abortController?.abort();
    }, [refreshComments]);

    if (comments) {
        return (
            <CommentsWrapper>
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment}></Comment>
                ))}
            </CommentsWrapper>
        );
    } else {
        return <div></div>;
    }
};

export default Comments;
