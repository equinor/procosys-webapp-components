import { Button, Menu, Scrim, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import EdsIcon from '../components/icons/EdsIcon';
import { ModalActionPanel } from './ActionsPanel';
import { ImageModal } from './Attachment';
import { AttachmentsWrapper } from './Attachments';
import UploadAttachment from './UploadAttachment';

export type TempAttachment = { id: string; file: File };

type TempAttachmentsProps = {
    setSnackbarText: (message: string) => void;
    setTempAttachmentIds: React.Dispatch<React.SetStateAction<string[]>>;
    postTempAttachment: (formData: FormData, title: string) => Promise<string>;
};

const TempAttachments = ({
    setSnackbarText,
    setTempAttachmentIds,
    postTempAttachment,
}: TempAttachmentsProps): JSX.Element => {
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
            <Button onClick={(): void => setShowUploadModal(true)}>
                <EdsIcon name="add" />
            </Button>
            {attachmentToShow ? (
                <Scrim
                    isDismissable
                    onClose={(): void => setAttachmentToShow(null)}
                >
                    <ImageModal pushImageUp={false}>
                        <img
                            src={URL.createObjectURL(attachmentToShow?.file)}
                            alt={'Temp attachment ' + attachmentToShow.id}
                        />
                        <ModalActionPanel>
                            <Menu.Item
                                color={'danger'}
                                onClick={(): void => {
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
