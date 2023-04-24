import React, { useEffect, useState } from 'react';
import { Button, Progress, TextField } from '@equinor/eds-core-react';
import { AsyncStatus } from '../../typings/enums';
import Comments from './Comments';
import { APIComment, PunchComment, PunchItem } from '../../typings/apiTypes';
import CollapsibleCard from '../CollapsibleCard';
import styled from 'styled-components';

const CommentField = styled.div`
    margin-top: 16px;
`;

type CommentCardProps = {
    plantId: string;
    punchItem: PunchItem;
    getPunchComments: (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ) => Promise<APIComment[]>;
    postPunchComment?: (
        plantId: string,
        comment: PunchComment
    ) => Promise<void>;
    showCommentTextField: boolean;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    abortController?: AbortController;
};

const CommentCard = ({
    plantId,
    punchItem,
    getPunchComments,
    postPunchComment,
    showCommentTextField,
    setSnackbarText,
    abortController,
}: CommentCardProps): JSX.Element => {
    const [punchComment, setPunchComment] = useState('');
    const [commentList, setCommentList] = useState<APIComment[]>([]);
    const [loadingStatus, setLoadingStatus] = useState(AsyncStatus.INACTIVE);

    const handleCommentChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void => setPunchComment(e.target.value);

    useEffect(() => {
        loadComments();
        return (): void => {
            abortController?.abort();
        };
    }, []);

    const loadComments = async (): Promise<void> => {
        setLoadingStatus(AsyncStatus.LOADING);
        try {
            const comments = await getPunchComments(
                plantId,
                punchItem.id,
                abortController?.signal
            );
            let fetchedComments: APIComment[] = [];
            try {
                fetchedComments = comments;
            } catch {
                console.log('Failed to fetch comments', comments);
            }
            setCommentList(fetchedComments);
            setLoadingStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setLoadingStatus(AsyncStatus.ERROR);
        }
    };

    const buttonClick = async (): Promise<void> => {
        if (punchComment && postPunchComment) {
            await postPunchComment(plantId, {
                PunchItemId: punchItem.id,
                Text: punchComment,
            });
            setPunchComment('');
        }
        loadComments();
    };

    return (
        <CommentField>
            {' '}
            <CollapsibleCard cardTitle="Comments" expanded={false}>
                {showCommentTextField ? (
                    <div>
                        {' '}
                        <TextField
                            maxLength={255}
                            value={punchComment}
                            label="Comment"
                            multiline
                            rows={5}
                            id="NewPunchComment"
                            onChange={handleCommentChange}
                        />{' '}
                        {loadingStatus === AsyncStatus.LOADING ? (
                            <Button disabled={true}>
                                <Progress.Circular size={16} />
                            </Button>
                        ) : (
                            <Button onClick={buttonClick}>Add comment</Button>
                        )}
                        <Comments
                            commentList={commentList}
                            abortController={abortController}
                        ></Comments>
                    </div>
                ) : (
                    <Comments
                        commentList={commentList}
                        abortController={abortController}
                    ></Comments>
                )}
            </CollapsibleCard>
        </CommentField>
    );
};

export default CommentCard;
