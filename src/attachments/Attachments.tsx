import { CancelToken } from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Attachment as AttachmentType } from '../services/apiTypes';
import Attachment, { DocumentAttachmentWrapper } from './Attachment';
import Axios from 'axios';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../components/icons/EdsIcon';
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
    getAttachments: (cancelToken: CancelToken) => Promise<AttachmentType[]>;
    getAttachment: (
        cancelToken: CancelToken,
        attachmentId: number
    ) => Promise<Blob>;
    postAttachment?: (file: FormData, title: string) => Promise<void>;
    deleteAttachment?: (attachmentId: number) => Promise<void>;
    setSnackbarText: (message: string) => void;
    readOnly: boolean;
};

const Attachments = (props: AttachmentsProps): JSX.Element => {
    const [refreshAttachments, setRefreshAttachments] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentType[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const source = Axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const attachmentsFromApi = await props.getAttachments(
                    source.token
                );
                setAttachments(attachmentsFromApi);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    props.setSnackbarText('Failed to load attachments.');
                }
            }
        })();
        return (): void => source.cancel();
    }, [refreshAttachments]);

    return (
        <AttachmentsWrapper>
            {attachments.map((attachment) => (
                <Attachment
                    key={attachment.id}
                    readOnly={props.readOnly}
                    getAttachment={(cancelToken: CancelToken): Promise<Blob> =>
                        props.getAttachment(cancelToken, attachment.id)
                    }
                    setSnackbarText={props.setSnackbarText}
                    attachment={attachment}
                    refreshAttachments={setRefreshAttachments}
                    deleteAttachment={props.deleteAttachment}
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
