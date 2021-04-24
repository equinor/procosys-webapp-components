import React, { useEffect, useState } from 'react';
import { AsyncStatus, ChecklistDetails } from '../services/apiTypes';
import {
    Button,
    Divider,
    TextField,
    Typography,
} from '@equinor/eds-core-react';
import styled from 'styled-components';
import {
    determineHelperText,
    determineVariant,
} from '../utils/textFieldHelpers';
import { Banner } from '@equinor/eds-core-react';
import { ProcosysApiService } from '../services/procosysApi';
const { BannerMessage, BannerIcon } = Banner;

const ChecklistSignatureWrapper = styled.div<{ helperTextVisible: boolean }>`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    & button,
    button:disabled {
        width: fit-content;
        margin-left: auto;
        margin-top: ${(props): string =>
            props.helperTextVisible ? '0' : '24px'};
    }
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

    return (
        <ChecklistSignatureWrapper
            helperTextVisible={putCommentStatus !== AsyncStatus.INACTIVE}
        >
            <p>
                {details.signedAt ? (
                    <>
                        Signed by {details.signedByFirstName}{' '}
                        {details.signedByLastName} at{' '}
                        {new Date(details.signedAt).toLocaleDateString('en-GB')}
                    </>
                ) : (
                    'This checklist is unsigned.'
                )}
            </p>
            <Divider />

            <TextField
                id={'comment-field'}
                maxLength={500}
                variant={determineVariant(putCommentStatus)}
                disabled={isSigned || putCommentStatus === AsyncStatus.LOADING}
                multiline
                rows={5}
                label="Comment"
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

            <Button
                onClick={handleSignClick}
                disabled={
                    signStatus === AsyncStatus.LOADING || !allItemsCheckedOrNA
                }
            >
                {determineSignButtonText(isSigned, signStatus)}
            </Button>
        </ChecklistSignatureWrapper>
    );
};

export default ChecklistSignature;
