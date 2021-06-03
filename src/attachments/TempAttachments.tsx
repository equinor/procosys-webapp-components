import { Button, Menu, Scrim, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useRef, useState } from 'react';
import EdsIcon from '../components/icons/EdsIcon';
import { AttachmentsWrapper, ImageModal, ModalActionPanel } from './Attachment';
import UploadAttachment from './UploadAttachment';

export type TempAttachment = { id: string; file: File };

type TempAttachmentsProps = {
    setSnackbarText: (message: string) => void;
    setTempAttachmentIds: React.Dispatch<React.SetStateAction<string[]>>;
    postTempAttachment: (formData: FormData, title: string) => Promise<string>;
};

const TempAttachments = ({
    postTempAttachment,
    setSnackbarText,
    setTempAttachmentIds,
}: TempAttachmentsProps) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [attachmentToShow, setAttachmentToShow] =
        useState<TempAttachment | null>(null);
    const [tempAttachments, setTempAttachments] = useState<TempAttachment[]>(
        []
    );

    useEffect(() => {
        setTempAttachmentIds(
            tempAttachments.map((attachment) => attachment.id)
        );
    }, [tempAttachments]);

    return (
        <AttachmentsWrapper>
            <Button onClick={(): void => setShowUploadModal(true)}>
                <EdsIcon name="camera_add_photo" />
            </Button>
            {tempAttachments.map((attachment) => (
                <img
                    key={attachment.id}
                    src={URL.createObjectURL(attachment.file)}
                    alt={'Temp attachment ' + attachment.id}
                    onClick={(): void => {
                        setAttachmentToShow(attachment);
                    }}
                />
            ))}
            {attachmentToShow ? (
                <Scrim isDismissable onClose={() => setAttachmentToShow(null)}>
                    <ImageModal>
                        <img
                            src={URL.createObjectURL(attachmentToShow?.file)}
                            alt={'Temp attachment ' + attachmentToShow.id}
                        />
                        <ModalActionPanel>
                            <Menu.Item
                                color={'danger'}
                                onClick={() => {
                                    setTempAttachments((prev) =>
                                        prev.filter(
                                            (attachment) =>
                                                attachment.id !==
                                                attachmentToShow.id
                                        )
                                    );
                                    setAttachmentToShow(null);
                                }}
                            >
                                <EdsIcon
                                    name="delete_to_trash"
                                    alt="Delete attachment"
                                />
                                Delete
                            </Menu.Item>
                            <Menu.Item
                                onClick={(): void => setAttachmentToShow(null)}
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
            {showUploadModal ? (
                <UploadAttachment
                    setShowModal={setShowUploadModal}
                    setSnackbarText={setSnackbarText}
                    postTempAttachment={postTempAttachment}
                    updateTempAttachments={setTempAttachments}
                />
            ) : null}
        </AttachmentsWrapper>
    );
};

export default TempAttachments;
