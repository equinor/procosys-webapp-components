import { Button, DotProgress, Scrim } from '@equinor/eds-core-react';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../contexts/CommAppContext';
import { TempAttachment } from '../pages/Punch/NewPunch/NewPunch';
import { ProcosysApiService } from '../services/procosysApi';
import { COLORS } from '../style/GlobalStyles';
import useCommonHooks from '../utils/useCommonHooks';

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

type PostChecklistAttachment = ProcosysApiService['postChecklistAttachment'];
type PostPunchAttachment = ProcosysApiService['postPunchAttachment'];
type PostTempAttachment = ProcosysApiService['postTempPunchAttachment'];

type UploadAttachmentProps = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    postAttachment:
        | PostPunchAttachment
        | PostChecklistAttachment
        | PostTempAttachment;
    updateAttachments?: Dispatch<SetStateAction<boolean>>;
    updateTempAttachments?: Dispatch<SetStateAction<TempAttachment[]>>;
    setSnackbarText: Dispatch<SetStateAction<string>>;
    parentId: string;
};

const UploadAttachment = ({
    setShowModal,
    postAttachment,
    updateAttachments,
    setSnackbarText,
    updateTempAttachments,
    parentId,
}: UploadAttachmentProps): JSX.Element => {
    const { params } = useCommonHooks();
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
            const response = await postAttachment({
                plantId: params.plant,
                parentId: parentId,
                data: formData,
                title: selectedFile.name,
            });
            if (updateTempAttachments) {
                //For new punch, this adds the new attachment to the list of attachments
                if (typeof response === 'string') {
                    updateTempAttachments((attachments) => [
                        ...attachments,
                        { id: response, file: selectedFile },
                    ]);
                } else {
                    console.error(
                        'Expected an ID response, but did not receive one.'
                    );
                }
            }
            if (updateAttachments) {
                updateAttachments((prev) => !prev);
            }
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
