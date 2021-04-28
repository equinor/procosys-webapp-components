import { Button, DotProgress, Scrim } from '@equinor/eds-core-react';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../services/apiTypes';
import { ProcosysApiService } from '../services/procosysApi';
import { COLORS } from '../style/GlobalStyles';

export const UploadContainer = styled.div`
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
    & > button,
    button:disabled {
        margin-top: 12px;
        margin-left: 8px;
        float: right;
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
    updateAttachments: Dispatch<SetStateAction<boolean>>;
    setSnackbarText: Dispatch<SetStateAction<string>>;
    api: ProcosysApiService;
};

const UploadAttachment = ({
    setShowModal,
    updateAttachments,
    setSnackbarText,
    api,
}: UploadAttachmentProps): JSX.Element => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [postAttachmentStatus, setPostAttachmentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const fileInputRef = useRef(document.createElement('input'));
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const currentFiles = e.currentTarget.files;
        if (currentFiles) setSelectedFile(currentFiles[0]);
    };

    const onFileUpload = async (): Promise<void> => {
        if (!selectedFile) return;
        setPostAttachmentStatus(AsyncStatus.LOADING);
        const formData = new FormData();
        formData.append(selectedFile.name, selectedFile);
        try {
            await api.postChecklistAttachment(formData, selectedFile.name);
            updateAttachments((prev) => !prev);
            setPostAttachmentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('File successfully added.');
            setShowModal(false);
        } catch (error) {
            setPostAttachmentStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    return (
        <Scrim isDismissable onClose={(): void => setShowModal(false)}>
            <UploadContainer>
                {selectedFile ? (
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt={selectedFile.name}
                    />
                ) : (
                    <ChooseImageContainer>
                        <Button
                            onClick={(): void => fileInputRef.current.click()}
                        >
                            Choose image...
                        </Button>
                    </ChooseImageContainer>
                )}
                <input
                    type="file"
                    onChange={onFileChange}
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

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
                        'Upload image'
                    )}
                </Button>
                {selectedFile ? (
                    <Button onClick={(): void => fileInputRef.current.click()}>
                        Choose other
                    </Button>
                ) : null}
            </UploadContainer>
        </Scrim>
    );
};

export default UploadAttachment;
