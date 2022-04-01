import React from 'react';
import { CancelToken, CancelTokenSource } from 'axios';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { Attachment, PunchItem } from '../../typings/apiTypes';
import { AsyncStatus } from '../../typings/enums';
import Attachments from '../Attachments/Attachments';

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
        punchItemId: number,
        cancelToken: CancelToken
    ) => Promise<Attachment[]>;
    getPunchAttachment: (
        cancelToken: CancelToken,
        plantId: string,
        punchItemId: number,
        attachmentId: number
    ) => Promise<Blob>;
    snackbar: JSX.Element;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    source: CancelTokenSource;
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
    snackbar,
    setSnackbarText,
    source,
}: VerifyPunchProps): JSX.Element => {
    const determineButtonsToRender = (): JSX.Element => {
        if (punchItem.verifiedByFirstName) {
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
                            canUnclear === false
                        }
                        onClick={handleUnclear}
                    >
                        Unclear
                    </Button>
                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canVerify === false
                        }
                        onClick={handleReject}
                    >
                        Reject
                    </Button>

                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canVerify === false
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
            <p>{punchItem.status}</p>
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
            <p>{punchItem.sorting ?? '--'}</p>
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
                    {new Date(punchItem.verifiedAt).toLocaleDateString()} by{' '}
                    {punchItem.verifiedByFirstName}{' '}
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
                    getPunchAttachments(plantId, punchItem.id, source.token)
                }
                getAttachment={(attachmentId: number): Promise<Blob> =>
                    getPunchAttachment(
                        source.token,
                        plantId,
                        punchItem.id,
                        attachmentId
                    )
                }
                setSnackbarText={setSnackbarText}
                source={source}
            />
            <ButtonGroup>{determineButtonsToRender()}</ButtonGroup>
            {snackbar}
        </VerifyPunchWrapper>
    );
};

export default VerifyPunch;
