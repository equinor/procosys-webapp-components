import {
    Button,
    CircularProgress,
    Scrim,
    Typography,
    Menu,
} from '@equinor/eds-core-react';
import Axios, { CancelToken } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
    AsyncStatus,
    Attachment as AttachmentType,
} from '../services/apiTypes';
import { COLORS } from '../style/GlobalStyles';
import handleDownload from '../utils/handleDownload';
import EdsIcon from './icons/EdsIcon';

export const UploadImageButton = styled(Button)``;

const AttachmentWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DocumentAttachmentWrapper = styled(AttachmentWrapper)`
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

export const ImageModal = styled.div`
    max-height: 80vh;
    padding: 12px;
    & > img {
        width: 100%;
        max-height: 65vh;
        object-fit: contain;
        margin-bottom: 150px;
    }
`;

export const AttachmentsWrapper = styled.div`
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
    padding: 12px 4%;
    & > img,
    > ${DocumentAttachmentWrapper}, > button {
        width: 100%;
        height: 100px;
    }
    & > img {
        object-fit: cover;
    }
`;

const ModalActionPanel = styled.div`
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
    & > li,
    & > li:hover {
        list-style-type: none;
        background: none;
    }
`;

type AttachmentProps = {
    attachment: AttachmentType;
    refreshAttachments?: React.Dispatch<React.SetStateAction<boolean>>;
    isSigned?: boolean;
    deleteAttachment?: (cancelToken: CancelToken) => Promise<void>;
    getAttachment: (cancelToken: CancelToken) => Promise<Blob>;
    setSnackbarText: (message: string) => void;
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
            <DocumentAttachmentWrapper>
                <Typography lines={3}>{attachment.title}</Typography>
                <Button variant={'ghost_icon'} onClick={loadAttachment}>
                    <EdsIcon
                        name="cloud_download"
                        color={COLORS.mossGreen}
                        alt={'download document'}
                    />
                </Button>
            </DocumentAttachmentWrapper>
        );
    };

    const imageAttachment = (): JSX.Element => {
        return (
            <>
                {showFullScreenImage ? (
                    <Scrim
                        isDismissable
                        onClose={(): void => setShowFullScreenImage(false)}
                    >
                        <ImageModal>
                            <img
                                src={attachmentFileURL}
                                alt={attachment.title}
                            />
                            <ModalActionPanel>
                                <Menu.Item
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
                                    <EdsIcon name="cloud_download" />
                                    <Typography
                                        group="navigation"
                                        variant="menu_title"
                                        as="span"
                                    >
                                        Download
                                    </Typography>
                                </Menu.Item>
                                {isSigned || !deleteAttachment ? null : (
                                    <Menu.Item
                                        color={'danger'}
                                        onClick={handleDelete}
                                    >
                                        <EdsIcon
                                            name="delete_to_trash"
                                            alt="Delete attachment"
                                        />
                                        {deleteStatus === AsyncStatus.LOADING
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </Menu.Item>
                                )}
                                <Menu.Item
                                    onClick={(): void =>
                                        setShowFullScreenImage(false)
                                    }
                                >
                                    <EdsIcon name="close" />
                                    <Typography
                                        group="navigation"
                                        variant="menu_title"
                                        as="span"
                                    >
                                        Close
                                    </Typography>
                                </Menu.Item>
                            </ModalActionPanel>
                        </ImageModal>
                    </Scrim>
                ) : null}
                {loadingStatus === AsyncStatus.LOADING ? (
                    <AttachmentWrapper>
                        <CircularProgress />
                    </AttachmentWrapper>
                ) : (
                    <img
                        src={`data:image/png;base64, ${attachment.thumbnailAsBase64}`}
                        alt={`${attachment.title} thumbnail`}
                        onClick={loadAttachment}
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
