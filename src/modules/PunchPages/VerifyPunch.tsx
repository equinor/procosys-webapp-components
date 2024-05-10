import React from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import {
    APIComment,
    Attachment,
    PunchItem,
    PunchListItem,
} from '../../typings/apiTypes';
import { AsyncStatus } from '../../typings/enums';
import Attachments from '../Attachments/Attachments';
import CommentCard from '../../components/Comments/CommentCard';

const VerifyPunchWrapper = styled.div`
    padding: 16px 4% 78px 4%;
    & > p {
        margin-top: 0;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    margin-top: 24px;
    justify-content: flex-end;
    & button,
    button:disabled {
        margin-left: 12px;
    }
`;

type VerifyPunchProps = {
    plantId: string;
    proCoSysGuid: string;
    punchItem: PunchListItem;
    canUnclear: boolean;
    canVerify: boolean;
    handleUnclear: () => Promise<void>;
    handleUnverify: () => Promise<void>;
    handleReject: () => Promise<void>;
    handleVerify: () => Promise<void>;
    punchActionStatus: AsyncStatus;
    getPunchAttachments: (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ) => Promise<Attachment[]>;
    getPunchAttachment: (
        plantId: string,
        punchItemId: number,
        attachmentId: number,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    getPunchComments?: (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ) => Promise<APIComment[]>;
    snackbar: JSX.Element;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    abortController?: AbortController;
};

const VerifyPunch = ({
    plantId,
    proCoSysGuid,
    punchItem,
    canUnclear,
    canVerify,
    handleUnclear,
    handleUnverify,
    handleReject,
    handleVerify,
    punchActionStatus,
    getPunchAttachments,
    getPunchAttachment,
    getPunchComments,
    snackbar,
    setSnackbarText,
    abortController,
}: VerifyPunchProps): JSX.Element => {
    const determineButtonsToRender = (): JSX.Element => {
        if (punchItem) {
            return (
                <Button
                    disabled={
                        punchActionStatus === AsyncStatus.LOADING ||
                        canVerify === false
                    }
                    onClick={handleUnverify}
                >
                    Unverify
                </Button>
            );
        } else {
            return (
                <>
                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canUnclear === false ||
                            punchItem.statusControlledBySwcr
                        }
                        onClick={handleUnclear}
                    >
                        Unclear
                    </Button>
                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canVerify === false ||
                            punchItem.statusControlledBySwcr
                        }
                        onClick={handleReject}
                    >
                        Rejecttt
                    </Button>

                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canVerify === false ||
                            punchItem.statusControlledBySwcr
                        }
                        onClick={handleVerify}
                    >
                        Verify
                    </Button>
                </>
            );
        }
    };

    return (
        <VerifyPunchWrapper>
            <label>Category:</label>
            <p>{punchItem.category}</p>
            <label>Description:</label>
            <p>{punchItem.description}</p>
            <label>Raised By:</label>
            <p>
                {punchItem.raisedByCode}. {punchItem.raisedByDescription}
            </p>
            <label>Clearing by:</label>
            <p>
                {punchItem.clearingByCode}. {punchItem.clearingByDescription}
            </p>
            <label>Action by person:</label>
            <p>
                {punchItem.actionByPerson
                    ? `${punchItem.actionByPersonFirstName} ${punchItem.actionByPersonLastName}`
                    : '--'}
            </p>
            <label>Due date:</label>
            <p>{punchItem.dueDate ?? '--'}</p>
            <label>Type:</label>
            <p>
                {punchItem.typeCode}. {punchItem.typeDescription}
            </p>
            <label>Sorting:</label>

            <label>Priority:</label>
            <p>
                {punchItem.priorityCode
                    ? `${punchItem.priorityCode} . ${punchItem.priorityDescription}`
                    : '--'}
            </p>
            <label>Estimate:</label>
            <p>{punchItem.estimate ?? '--'}</p>
            <label>Signatures:</label>
            {punchItem.clearedAt ? (
                <p>
                    Cleared at{' '}
                    {new Date(punchItem.clearedAt).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.clearedByFirstName}{' '}
                    {punchItem.clearedByLastName} ({punchItem.clearedByUser})
                </p>
            ) : null}
            {punchItem.verifiedAt ? (
                <p>
                    Verified at{' '}
                    {new Date(punchItem.verifiedAt).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.verifiedByFirstName}{' '}
                    {punchItem.verifiedByLastName} ({punchItem.verifiedByUser})
                </p>
            ) : null}
            {punchItem.rejectedAt ? (
                <p>
                    Rejected at{' '}
                    {new Date(punchItem.rejectedAt).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.rejectedByFirstName}{' '}
                    {punchItem.rejectedByLastName} ({punchItem.rejectedByUser})
                </p>
            ) : null}

            <Attachments
                readOnly
                getAttachments={(): Promise<Attachment[]> =>
                    getPunchAttachments(
                        plantId,
                        punchItem.id,
                        abortController?.signal
                    )
                }
                getAttachment={(attachmentId: number): Promise<Blob> =>
                    getPunchAttachment(
                        plantId,
                        punchItem.id,
                        attachmentId,
                        abortController?.signal
                    )
                }
                setSnackbarText={setSnackbarText}
                abortController={abortController}
            />
            {getPunchComments ? (
                <CommentCard
                    plantId={plantId}
                    punchItem={punchItem}
                    getPunchComments={getPunchComments}
                    showCommentTextField={false}
                    setSnackbarText={setSnackbarText}
                ></CommentCard>
            ) : (
                <></>
            )}
            <ButtonGroup>{determineButtonsToRender()}</ButtonGroup>
            {snackbar}
        </VerifyPunchWrapper>
    );
};

export default VerifyPunch;
