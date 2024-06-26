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

const TextFieldWrapper = styled(TextField)`
    margin-bottom: 8px;
`;

const ButtonWrapper = styled(Button)`
    width: 150px;
`;

type CommentCardProps = {
    plantId: string;
    punchItem: PunchItem;
    getPunchComments: (
        plantId: string,
        guid: string
    ) => Promise<APIComment[]>;
    postPunchComment?: (
        plantId: string,
        guid: string,
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
                punchItem.guid
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
            await postPunchComment(plantId,
                punchItem.guid,
                {text: punchComment, labels: [], mentions: []},
            );
            setPunchComment('');
        }
        loadComments();
    };

    return (
        <CommentField>
            {' '}
            <CollapsibleCard cardTitle="Comments">
                {showCommentTextField ? (
                    <div>
                        {' '}
                        <TextFieldWrapper
                            maxLength={255}
                            value={punchComment}
                            label="Comment"
                            multiline
                            rows={5}
                            id="NewPunchComment"
                            onChange={handleCommentChange}
                        />{' '}
                        {loadingStatus === AsyncStatus.LOADING ? (
                            <ButtonWrapper disabled={true}>
                                <Progress.Circular size={16} />
                            </ButtonWrapper>
                        ) : (
                            <ButtonWrapper onClick={buttonClick}>
                                Add comment
                            </ButtonWrapper>
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
