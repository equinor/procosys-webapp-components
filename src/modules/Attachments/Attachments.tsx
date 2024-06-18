import { Button } from '@equinor/eds-core-react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { Attachment as AttachmentType } from '../../typings/apiTypes';
import Attachment, { DocumentAttachmentWrapper } from './Attachment';
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
    getAttachments: (abortSignal?: AbortSignal) => Promise<AttachmentType[]>;
    getAttachment: (
        attachmentGuid: string,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    postAttachment?: (file: FormData, title: string) => Promise<void>;
    deleteAttachment?: (
        attachmentId: string | number,
        attachmentRowVersion?: string
    ) => Promise<void>;
    setSnackbarText: (message: string) => void;
    readOnly: boolean;
    abortController?: AbortController;
};

const Attachments = (props: AttachmentsProps): JSX.Element => {
    const [refreshAttachments, setRefreshAttachments] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentType[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const attachmentsFromApi = await props.getAttachments(
                    props.abortController?.signal
                );
                setAttachments(attachmentsFromApi);
            } catch (error) {
                if (!(error instanceof Error)) return;
                props.setSnackbarText(error.message);
            }
        })();
        return (): void => props.abortController?.abort();
    }, [refreshAttachments]);

    return (
        <AttachmentsWrapper>
            {attachments?.map((attachment) => (
                <Attachment
                    key={attachment.guid}
                    readOnly={props.readOnly}
                    getAttachment={(
                        abortSignal?: AbortSignal
                    ): Promise<Blob> => {
                        return props.getAttachment(
                            attachment.id.toString(), 
                            abortSignal
                        );
                    }}
                    setSnackbarText={props.setSnackbarText}
                    attachment={attachment}
                    refreshAttachments={setRefreshAttachments}
                    deleteAttachment={props.deleteAttachment}
                    abortController={props.abortController}
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
