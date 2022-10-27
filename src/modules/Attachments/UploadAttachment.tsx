import { Button, DotProgress, Scrim } from '@equinor/eds-core-react';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import { AsyncStatus } from '../../typings/enums';
import { TempAttachment } from '../Attachments/TempAttachments';

export const UploadContainer = styled.div`
    border-radius: 5px;
    max-height: 80vh;
    width: 300px;
    background-color: ${COLORS.white};
    padding: 16px;
    overflow: scroll;
    & img {
        width: 100%;
        max-height: 200px;
        object-fit: contain;
    }
`;

const ButtonWrapper = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    & button:first-of-type {
        margin-right: 12px;
    }
`;

const ChooseImageContainer = styled.div`
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed ${COLORS.fadedBlue};
`;

type UploadAttachmentProps = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    setSnackbarText: (message: string) => void;
    updateTempAttachments?: Dispatch<SetStateAction<TempAttachment[]>>;
    updateAttachments?: Dispatch<SetStateAction<boolean>>;
    postTempAttachment?: (formData: FormData, title: string) => Promise<string>;
    postAttachment?: (formData: FormData, title: string) => Promise<void>;
};

const UploadAttachment = ({
    setShowModal,
    setSnackbarText,
    updateTempAttachments,
    updateAttachments,
    postTempAttachment,
    postAttachment,
}: UploadAttachmentProps): JSX.Element => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [postAttachmentStatus, setPostAttachmentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [isDocument, setIsDocument] = useState<boolean>(false);
    const fileInputRef = useRef(document.createElement('input'));
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const currentFiles = e.currentTarget.files;
        if (currentFiles) {
            setSelectedFile(currentFiles[0]);
            if (currentFiles[0].name.match(/.(jpg|jpeg|png|gif)$/i) === null) {
                setIsDocument(true);
            }
        }
    };

    const isUnsupportedFileType = (fileName: string): boolean => {
        const rejectedFileExtensions =
            /(\.exe|\.msi|\.dotm|\.docm|\.xlsm|\.xltm)$/i;
        const rejected = rejectedFileExtensions.exec(fileName);
        if (rejected) {
            setSnackbarText('File type not suppported');
            return true;
        }
        return false;
    };

    const isOverMaxFileSize = (fileSize: number): boolean => {
        const maxSize = 60000000;
        if (fileSize >= maxSize) {
            setSnackbarText('File size must be below 60 MB.');
            return true;
        }
        return false;
    };

    const onFileUpload = async (): Promise<void> => {
        if (!selectedFile) return;
        if (isUnsupportedFileType(selectedFile.name)) return;
        if (isOverMaxFileSize(selectedFile.size)) return;

        setPostAttachmentStatus(AsyncStatus.LOADING);
        const formData = new FormData();
        formData.append(selectedFile.name, selectedFile);
        try {
            if (postTempAttachment && updateTempAttachments) {
                const response = await postTempAttachment(
                    formData,
                    selectedFile.name
                );
                updateTempAttachments((attachments) => [
                    ...attachments,
                    { id: response, file: selectedFile },
                ]);
            } else if (postAttachment && updateAttachments) {
                await postAttachment(formData, selectedFile.name);
                updateAttachments((prev) => !prev);
                setPostAttachmentStatus(AsyncStatus.SUCCESS);
            } else {
                throw new Error(
                    'Failed to distinguish between attachment and temporary attachment.'
                );
            }
            setSnackbarText('File successfully added.');
            setShowModal(false);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setPostAttachmentStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    return (
        <Scrim
            isDismissable
            onClose={(): void => setShowModal(false)}
            open={true}
        >
            <UploadContainer>
                {selectedFile ? (
                    isDocument ? (
                        selectedFile.name
                    ) : (
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt={selectedFile.name}
                        />
                    )
                ) : (
                    <ChooseImageContainer>
                        <Button
                            onClick={(): void => fileInputRef.current.click()}
                        >
                            Choose file...
                        </Button>
                    </ChooseImageContainer>
                )}
                <input
                    type="file"
                    onChange={onFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <ButtonWrapper>
                    {selectedFile ? (
                        <Button
                            onClick={(): void => fileInputRef.current.click()}
                        >
                            Choose other
                        </Button>
                    ) : null}
                    <Button
                        disabled={
                            !selectedFile ||
                            postAttachmentStatus === AsyncStatus.LOADING
                        }
                        onClick={onFileUpload}
                    >
                        {postAttachmentStatus === AsyncStatus.LOADING ? (
                            <DotProgress color="primary" />
                        ) : (
                            'Upload file'
                        )}
                    </Button>
                </ButtonWrapper>
            </UploadContainer>
        </Scrim>
    );
};

export default UploadAttachment;
