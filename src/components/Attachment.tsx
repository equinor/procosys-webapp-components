import {
    Button,
    CircularProgress,
    Scrim,
    Typography,
} from '@equinor/eds-core-react';
import Axios, { CancelToken } from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { Attachment as AttachmentType } from '../services/apiTypes';
import { COLORS } from '../style/GlobalStyles';
import handleDownload from '../utils/handleDownload';
import EdsIcon from './icons/EdsIcon';

const ATTACHMENT_SIZE = '112px';

export const AttachmentsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export const UploadImageButton = styled(Button)`
    height: ${ATTACHMENT_SIZE};
    width: ${ATTACHMENT_SIZE};
    margin: 8px;
    &:disabled {
        height: ${ATTACHMENT_SIZE};
        width: ${ATTACHMENT_SIZE};
        margin: 8px;
    }
`;

const AttachmentWrapper = styled.div`
    height: ${ATTACHMENT_SIZE};
    width: ${ATTACHMENT_SIZE};
    margin: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DocumentAttachmentWrapper = styled(AttachmentWrapper)`
    background-color: ${COLORS.fadedBlue};
    border: 2px solid ${COLORS.mossGreen};
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
    & > svg {
        position: absolute;
        bottom: 8px;
        left: 50px;
    }
`;

export const AttachmentImage = styled.img`
    height: ${ATTACHMENT_SIZE};
    margin: 8px;
`;

export const ImageModal = styled.div`
    width: 80vw;
    max-height: 80vh;
    padding: 16px;
    & > img {
        width: 100%;
        max-height: 65vh;
        object-fit: contain;
    }
`;

const DeleteButton = styled(Button)`
    left: 0;
`;

const ButtonGroup = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    max-width: 160px;
    justify-content: center;
    & > button,
    button:disabled {
        margin-top: 4px;
    }
`;

type AttachmentProps = {
    attachment: AttachmentType;
    refreshAttachments?: React.Dispatch<React.SetStateAction<boolean>>;
    isSigned?: boolean;
    deleteAttachment?: (cancelToken: CancelToken) => Promise<void>;
    getAttachment: (cancelToken: CancelToken) => Promise<Blob>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const Attachment = ({
    attachment,
    getAttachment,
    deleteAttachment,
    refreshAttachments,
    setSnackbarText,
    isSigned = false,
}: AttachmentProps): JSX.Element => {
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);
    const [attachmentFileURL, setAttachmentFileURL] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(AsyncStatus.INACTIVE);
    const [deleteStatus, setDeleteStatus] = useState(AsyncStatus.INACTIVE);
    const isDocument = attachment.mimeType.substr(0, 5) !== 'image';
    const source = Axios.CancelToken.source();

    useEffect(() => {
        return (): void => {
            source.cancel();
        };
    }, []);

    const loadAttachment = async (): Promise<void> => {
        setLoadingStatus(AsyncStatus.LOADING);
        try {
            const blob = await getAttachment(source.token);
            let imageUrl = '';
            try {
                imageUrl = window.URL.createObjectURL(blob);
            } catch {
                console.log('Failed to create object URL from blob: ', blob);
            }
            setAttachmentFileURL(imageUrl);
            if (!isDocument) {
                setShowFullScreenImage(true);
            } else {
                handleDownload(imageUrl, attachment.fileName);
            }
            setLoadingStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!Axios.isCancel(error)) {
                setSnackbarText('Unable to load image.');
                setLoadingStatus(AsyncStatus.ERROR);
            }
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (!deleteAttachment) return;
        setDeleteStatus(AsyncStatus.LOADING);
        try {
            await deleteAttachment(source.token);
            setSnackbarText('Attachment successfully removed');
            refreshAttachments && refreshAttachments((prev) => !prev);
            setDeleteStatus(AsyncStatus.SUCCESS);
            setShowFullScreenImage(false);
        } catch (error) {
            if (!Axios.isCancel(error)) {
                setDeleteStatus(AsyncStatus.ERROR);
                setSnackbarText(error.toString());
            }
        }
    };

    if (attachment.mimeType.substr(0, 5) !== 'image') {
        if (deleteStatus === AsyncStatus.LOADING) {
            return (
                <AttachmentWrapper>
                    <CircularProgress />
                </AttachmentWrapper>
            );
        }
        return (
            <DocumentAttachmentWrapper>
                <Typography lines={3}>{attachment.title}</Typography>
                {/* 
                *
                Uncomment this to enable deletion of document attachments
                *
                <DeleteButton variant={'ghost_icon'} onClick={handleDelete}>
                    <EdsIcon
                        name="delete_to_trash"
                        color={COLORS.mossGreen}
                        alt={'delete document'}
                    />
                </DeleteButton> */}

                <Button variant={'ghost_icon'} onClick={loadAttachment}>
                    <EdsIcon
                        name="cloud_download"
                        color={COLORS.mossGreen}
                        alt={'download document'}
                    />
                </Button>
            </DocumentAttachmentWrapper>
        );
    }

    return (
        <>
            {showFullScreenImage ? (
                <Scrim
                    isDismissable
                    onClose={(): void => setShowFullScreenImage(false)}
                >
                    <ImageModal>
                        <img src={attachmentFileURL} alt={attachment.title} />
                        <ButtonGroup>
                            <Button
                                onClick={(): void =>
                                    setShowFullScreenImage(false)
                                }
                            >
                                <EdsIcon name="close" />
                                Close
                            </Button>
                            <Button
                                onClick={(): void => {
                                    handleDownload(
                                        attachmentFileURL,
                                        attachment.fileName
                                    );
                                    setSnackbarText(
                                        'Image successfully downloaded.'
                                    );
                                }}
                            >
                                <EdsIcon name="cloud_download" size={32} />
                                Download
                            </Button>
                            {isSigned || !deleteAttachment ? null : (
                                <Button
                                    color={'danger'}
                                    onClick={handleDelete}
                                    disabled={
                                        deleteStatus === AsyncStatus.LOADING ||
                                        !deleteAttachment
                                    }
                                >
                                    <EdsIcon
                                        name="delete_to_trash"
                                        color={
                                            deleteStatus === AsyncStatus.LOADING
                                                ? COLORS.black
                                                : COLORS.white
                                        }
                                        alt="Delete attachment"
                                    />
                                    {deleteStatus === AsyncStatus.LOADING
                                        ? 'Loading...'
                                        : 'Delete'}
                                </Button>
                            )}
                        </ButtonGroup>
                    </ImageModal>
                </Scrim>
            ) : null}
            {loadingStatus === AsyncStatus.LOADING ? (
                <AttachmentWrapper>
                    <CircularProgress />
                </AttachmentWrapper>
            ) : (
                <AttachmentImage
                    src={`data:image/png;base64, ${attachment.thumbnailAsBase64}`}
                    alt={`${attachment.title} thumbnail`}
                    onClick={loadAttachment}
                />
            )}
        </>
    );
};

export default Attachment;
