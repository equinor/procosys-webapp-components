import {
    Button,
    CircularProgress,
    Scrim,
    Typography,
} from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ActionsPanel from './ActionsPanel';
import { AsyncStatus } from '../../typings/enums';
import { COLORS } from '../../style/GlobalStyles';
import {
    Attachment as AttachmentType,
    AttachmentInList,
} from '../../typings/apiTypes';
import EdsIcon from '../../components/icons/EdsIcon';

const AttachmentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const DocumentAttachmentWrapper = styled(AttachmentWrapper)`
    border: 1px solid ${COLORS.mossGreen};
    overflow: hidden;
    box-sizing: border-box;
    padding: 8px;
    padding-top: 15px;
    position: relative;
    align-items: flex-start;
    justify-content: flex-start;
    & > button {
        position: absolute;
        bottom: 0;
        right: 5px;
    }
`;

export const ImageModal = styled.div<{ pushImageUp: boolean }>`
    position: relative;
    & > img {
        position: fixed;
        bottom: ${(props): string => (props.pushImageUp ? '180px' : '145px')};
        left: 50%;
        transform: translateX(-50%);
        max-width: 95vw;
        max-height: ${(props): string => (props.pushImageUp ? '65vh' : '70vh')};
        object-fit: contain;
    }
`;

type AttachmentProps = {
    attachment: AttachmentType | AttachmentInList;
    refreshAttachments?: React.Dispatch<React.SetStateAction<boolean>>;
    readOnly: boolean;
    deleteAttachment?: (attachmentId: number) => Promise<void>;
    getAttachment: (abortSignal?: AbortSignal) => Promise<Blob>;
    setSnackbarText: (message: string) => void;
    abortController?: AbortController;
};

const Attachment = ({
    attachment,
    getAttachment,
    deleteAttachment,
    refreshAttachments,
    setSnackbarText,
    readOnly,
    abortController,
}: AttachmentProps): JSX.Element => {
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);
    const [attachmentFileURL, setAttachmentFileURL] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(AsyncStatus.INACTIVE);
    const [deleteStatus, setDeleteStatus] = useState(AsyncStatus.INACTIVE);
    const isDocument = attachment.mimeType.substr(0, 5) !== 'image';

    useEffect(() => {
        loadAttachment();
        return (): void => {
            abortController?.abort();
        };
    }, []);

    const loadAttachment = async (): Promise<void> => {
        setLoadingStatus(AsyncStatus.LOADING);
        try {
            const blob = await getAttachment(abortController?.signal);
            let imageUrl = '';
            try {
                imageUrl = window.URL.createObjectURL(blob);
            } catch {
                console.log('Failed to create object URL from blob: ', blob);
            }
            setAttachmentFileURL(imageUrl);
            setLoadingStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setLoadingStatus(AsyncStatus.ERROR);
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (!deleteAttachment) return;
        setDeleteStatus(AsyncStatus.LOADING);
        try {
            await deleteAttachment(attachment.id);
            setSnackbarText('Attachment successfully removed');
            refreshAttachments && refreshAttachments((prev) => !prev);
            setDeleteStatus(AsyncStatus.SUCCESS);
            setShowFullScreenImage(false);
        } catch (error) {
            setDeleteStatus(AsyncStatus.ERROR);
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    const uriAttachment = (): JSX.Element => {
        return (
            <DocumentAttachmentWrapper>
                <Typography lines={3}>{attachment.title}</Typography>
                <Button
                    variant={'ghost_icon'}
                    onClick={(): Window | null =>
                        window.open(attachment.uri, '_blank')
                    }
                >
                    <EdsIcon
                        name="external_link"
                        color={COLORS.mossGreen}
                        alt={'Go to link destination'}
                    />
                </Button>
            </DocumentAttachmentWrapper>
        );
    };

    const documentAttachment = (): JSX.Element => {
        return (
            <>
                {showFullScreenImage ? (
                    <Scrim
                        isDismissable
                        onClose={(): void => setShowFullScreenImage(false)}
                        open={true}
                    >
                        <ActionsPanel
                            attachmentFileURL={attachmentFileURL}
                            fileName={attachment.fileName}
                            setSnackbarText={setSnackbarText}
                            readOnly={readOnly}
                            deleteStatus={deleteStatus}
                            setShowFullScreenImage={setShowFullScreenImage}
                            handleDelete={
                                deleteAttachment ? handleDelete : undefined
                            }
                        />
                    </Scrim>
                ) : null}
                {loadingStatus === AsyncStatus.LOADING ? (
                    <AttachmentWrapper>
                        <CircularProgress />
                    </AttachmentWrapper>
                ) : (
                    <DocumentAttachmentWrapper
                        onClick={(): void => {
                            setShowFullScreenImage(true);
                        }}
                    >
                        <Typography lines={3}>{attachment.title}</Typography>
                        <Button variant={'ghost_icon'}>
                            <EdsIcon
                                name="download"
                                color={COLORS.mossGreen}
                                alt={'open action menu'}
                            />
                        </Button>
                    </DocumentAttachmentWrapper>
                )}
            </>
        );
    };

    const imageAttachment = (): JSX.Element => {
        return (
            <>
                {showFullScreenImage ? (
                    <Scrim
                        isDismissable
                        onClose={(): void => setShowFullScreenImage(false)}
                        open={true}
                    >
                        <ImageModal pushImageUp={!readOnly}>
                            <img
                                src={attachmentFileURL}
                                alt={attachment.title}
                            />
                            <ActionsPanel
                                attachmentFileURL={attachmentFileURL}
                                fileName={attachment.fileName}
                                setSnackbarText={setSnackbarText}
                                readOnly={readOnly}
                                deleteStatus={deleteStatus}
                                setShowFullScreenImage={setShowFullScreenImage}
                                handleDelete={
                                    deleteAttachment ? handleDelete : undefined
                                }
                            />
                        </ImageModal>
                    </Scrim>
                ) : null}
                {loadingStatus === AsyncStatus.LOADING ? (
                    <AttachmentWrapper>
                        <CircularProgress />
                    </AttachmentWrapper>
                ) : (
                    <img
                        src={attachmentFileURL}
                        alt={`${attachment.title} thumbnail`}
                        onClick={(): void => {
                            setShowFullScreenImage(true);
                        }}
                    />
                )}
            </>
        );
    };

    if (attachment.uri) {
        return uriAttachment();
    } else if (isDocument) {
        return documentAttachment();
    } else {
        return imageAttachment();
    }
};

export default Attachment;
