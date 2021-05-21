import React, { useEffect, useState } from 'react';
import { AsyncStatus, ChecklistDetails } from '../services/apiTypes';
import { Button, TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import {
    determineHelperText,
    determineVariant,
} from '../utils/textFieldHelpers';
import { ProcosysApiService } from '../services/procosysApi';

const ChecklistSignatureWrapper = styled.div<{ helperTextVisible: boolean }>`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 12px 4%;
    margin-bottom: 12px;
    & button,
    button:disabled {
        margin-left: 24px;
        width: fit-content;
    }
`;

const CommentHeader = styled.h5`
    margin-top: 24px;
    margin-bottom: 12px;
`;

const BottomContentWrapper = styled.div<{ readyToSign: boolean }>`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 12px;
    background-color: ${(props): string =>
        props.readyToSign ? '#deecee' : '#eb003726'};
    padding: 0 16px;
`;

const determineSignButtonText = (
    isSigned: boolean,
    status: AsyncStatus
): string => {
    if (status === AsyncStatus.LOADING) {
        if (isSigned) return 'Unsigning...';
        return 'Signing...';
    } else {
        if (isSigned) return 'Unsign';
        return 'Sign';
    }
};

type ChecklistSignatureProps = {
    details: ChecklistDetails;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    isSigned: boolean;
    allItemsCheckedOrNA: boolean;
    reloadChecklist: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    api: ProcosysApiService;
};

const ChecklistSignature = ({
    details,
    setIsSigned,
    isSigned,
    allItemsCheckedOrNA,
    reloadChecklist,
    setSnackbarText,
    api,
}: ChecklistSignatureProps): JSX.Element => {
    const [comment, setComment] = useState(details.comment);
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [signStatus, setSignStatus] = useState(AsyncStatus.INACTIVE);
    let commentBeforeFocus = '';

    const putComment = async (): Promise<void> => {
        if (comment === commentBeforeFocus) return;
        setPutCommentStatus(AsyncStatus.LOADING);
        try {
            await api.putChecklistComment(comment);
            setPutCommentStatus(AsyncStatus.SUCCESS);
            reloadChecklist((prev) => !prev);
        } catch (error) {
            setPutCommentStatus(AsyncStatus.ERROR);
        }
    };

    const handleSignClick = async (): Promise<void> => {
        setSignStatus(AsyncStatus.LOADING);
        try {
            if (isSigned) {
                await api.postUnsign();
                setIsSigned(false);
            } else {
                await api.postSign();
                setIsSigned(true);
            }
            setSignStatus(AsyncStatus.SUCCESS);
            setSnackbarText(
                isSigned ? 'Unsign complete.' : 'Signing complete.'
            );
            reloadChecklist((reloadStatus) => !reloadStatus);
        } catch (error) {
            setSignStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const updatedByText = (): string => {
        return `Updated by ${details.updatedByFirstName} ${
            details.updatedByLastName
        } at ${new Date(details.updatedAt).toLocaleDateString('en-GB')}`;
    };

    useEffect(() => {
        if (
            putCommentStatus === AsyncStatus.INACTIVE ||
            putCommentStatus === AsyncStatus.LOADING
        )
            return;
        setTimeout(() => {
            setPutCommentStatus(AsyncStatus.INACTIVE);
        }, 2000);
    }, [putCommentStatus]);

    const determineSignatureText = () => {
        if (isSigned) {
            return (
                <p>
                    Signed by {details.signedByFirstName}{' '}
                    {details.signedByLastName} at{' '}
                    {new Date(details.signedAt).toLocaleDateString('en-GB')}
                </p>
            );
        }
        if (allItemsCheckedOrNA) {
            return <p>Checklist is ready to be signed.</p>;
        }
        if (!isSigned && !allItemsCheckedOrNA) {
            return <p>All items must be checked or NA before signing.</p>;
        }
        return <></>;
    };

    return (
        <ChecklistSignatureWrapper
            helperTextVisible={putCommentStatus !== AsyncStatus.INACTIVE}
        >
            <CommentHeader>Comment and sign</CommentHeader>
            <TextField
                id={'comment-field'}
                maxLength={500}
                variant={determineVariant(putCommentStatus)}
                disabled={isSigned || putCommentStatus === AsyncStatus.LOADING}
                multiline
                rows={5}
                helperText={
                    putCommentStatus === AsyncStatus.INACTIVE &&
                    details.updatedAt
                        ? updatedByText()
                        : determineHelperText(putCommentStatus)
                }
                value={comment}
                onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ): void => setComment(e.target.value)}
                onFocus={(): string => (commentBeforeFocus = comment)}
                onBlur={putComment}
            />
            <BottomContentWrapper readyToSign={allItemsCheckedOrNA}>
                {determineSignatureText()}
                <Button
                    onClick={handleSignClick}
                    disabled={
                        signStatus === AsyncStatus.LOADING ||
                        !allItemsCheckedOrNA
                    }
                >
                    {determineSignButtonText(isSigned, signStatus)}
                </Button>
            </BottomContentWrapper>
        </ChecklistSignatureWrapper>
    );
};

export default ChecklistSignature;
