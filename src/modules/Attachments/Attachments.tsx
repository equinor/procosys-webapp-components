import { CancelToken, CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Attachment as AttachmentType } from '../../typings/apiTypes';
import Attachment, { DocumentAttachmentWrapper } from './Attachment';
import axios from 'axios';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../../components/icons/EdsIcon';
import UploadAttachment from './UploadAttachment';

export const AttachmentsWrapper = styled.div`
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
    & > img,
    > ${DocumentAttachmentWrapper}, > button {
        width: 100%;
        height: 100px;
    }
    & > img {
        object-fit: cover;
    }
`;

type AttachmentsProps = {
    getAttachments: (cancelToken?: CancelToken) => Promise<AttachmentType[]>;
    getAttachment: (
        attachmentId: number,
        cancelToken?: CancelToken
    ) => Promise<Blob>;
    postAttachment?: (file: FormData, title: string) => Promise<void>;
    deleteAttachment?: (attachmentId: number) => Promise<void>;
    setSnackbarText: (message: string) => void;
    readOnly: boolean;
    source: CancelTokenSource;
};

const Attachments = (props: AttachmentsProps): JSX.Element => {
    const [refreshAttachments, setRefreshAttachments] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentType[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const attachmentsFromApi = await props.getAttachments(
                    props.source.token
                );
                setAttachments(attachmentsFromApi);
                console.log('set attachments');
            } catch (error) {
                console.log('error in getting attachments');
                console.log(error);
                if (!axios.isCancel(error)) {
                    props.setSnackbarText('Failed to load attachments.');
                }
            }
        })();
        return (): void => props.source.cancel();
    }, [refreshAttachments]);

    return (
        <AttachmentsWrapper>
            {attachments.map((attachment) => (
                <Attachment
                    key={attachment.id}
                    readOnly={props.readOnly}
                    getAttachment={(cancelToken: CancelToken): Promise<Blob> =>
                        props.getAttachment(attachment.id, cancelToken)
                    }
                    setSnackbarText={props.setSnackbarText}
                    attachment={attachment}
                    refreshAttachments={setRefreshAttachments}
                    deleteAttachment={props.deleteAttachment}
                    source={props.source}
                />
            ))}
            {props.readOnly ? null : (
                <Button onClick={(): void => setShowUploadModal(true)}>
                    <EdsIcon name={'add'} size={40} />
                </Button>
            )}
            {showUploadModal ? (
                <UploadAttachment
                    setShowModal={setShowUploadModal}
                    setSnackbarText={props.setSnackbarText}
                    updateAttachments={setRefreshAttachments}
                    postAttachment={props.postAttachment}
                />
            ) : null}
        </AttachmentsWrapper>
    );
};

export default Attachments;
