import React from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { APIComment, Attachment, PunchItem } from '../../typings/apiTypes';
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
    punchItem: PunchItem;
    canUnclear: boolean;
    canVerify: boolean;
    handleUnclear: () => Promise<void>;
    handleUnverify: () => Promise<void>;
    handleReject: () => Promise<void>;
    handleVerify: () => Promise<void>;
    punchActionStatus: AsyncStatus;
    getPunchAttachments: (
        plantId: string,
        guid: string,
    ) => Promise<Attachment[]>;
    getPunchAttachment: (
        plantId: string,
        punchGuid: string,
        attachmentGuid: string,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    getPunchComments?: (
        plantId: string,
        guid: string
    ) => Promise<APIComment[]>;
    snackbar: JSX.Element;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    abortController?: AbortController;
};

const VerifyPunch = ({
    plantId,
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
        if (punchItem.verifiedBy?.firstName) {
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
                        Reject
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
                {punchItem.raisedByOrg?.code}. {punchItem.raisedByOrg?.description}
            </p>
            <label>Clearing by:</label>
            <p>
                {punchItem.clearingByOrg?.code}. {punchItem.clearingByOrg?.description}
            </p>
            <label>Action by person:</label>
            <p>
                {punchItem.actionBy?.firstName
                    ? `${punchItem.actionBy.firstName} ${punchItem.actionBy?.lastName}`
                    : '--'}
            </p>
            <label>Due date:</label>
            <p>{punchItem.dueTimeUtc ?? '--'}</p>
            <label>Type:</label>
            <p>
                {punchItem.typeCode}. {punchItem.typeDescription}
            </p>
            <label>Sorting:</label>
            <p>{punchItem.sorting?.code ?? '--'}</p>
            <label>Priority:</label>
            <p>
                {punchItem.priority?.code
                    ? `${punchItem.priority?.code} . ${punchItem.priority?.description}`
                    : '--'}
            </p>
            <label>Estimate:</label>
            <p>{punchItem.estimate ?? '--'}</p>
            <label>Signatures:</label>
            {punchItem.clearedAtUtc ? (
                <p>
                    Cleared at{' '}
                    {new Date(punchItem.clearedAtUtc).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.clearedBy.firstName}{' '}
                    {punchItem.clearedBy?.lastName} ({punchItem.clearedBy.userName})
                </p>
            ) : null}
            {punchItem.verifiedAtUtc ? (
                <p>
                    Verified at{' '}
                    {new Date(punchItem.verifiedAtUtc).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.verifiedBy.firstName}{' '}
                    {punchItem.verifiedBy.lastName} ({punchItem.verifiedBy.userName})
                </p>
            ) : null}
            {punchItem.rejectedAtUtc ? (
                <p>
                    Rejected at{' '}
                    {new Date(punchItem.rejectedAtUtc).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.rejectedBy.firstName}{' '}
                    {punchItem.rejectedBy.lastName} ({punchItem.rejectedBy.userName})
                </p>
            ) : null}

            <Attachments
                readOnly
                getAttachments={(): Promise<Attachment[]> =>
                    getPunchAttachments(
                        plantId,
                        punchItem.guid
                    )
                }
                getAttachment={(attachmentGuid: string): Promise<Blob> =>
                    getPunchAttachment(
                        plantId,
                        punchItem.guid,
                        attachmentGuid,
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
