import { Button } from '@equinor/eds-core-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { AsyncStatus } from '../../typings/enums';
import TagSelectionModal from './TagSelectionModal';
import { postByFetch, postByFetchSimple } from '../../services/apiHelpers';

const CaptureInput = styled.input`
    display: none;
`;

const CaptureButton = styled(Button)`
    position: absolute;
    right: 1.5%;
    top: 3px;
    z-index: 200;
    background-color: #f7f7f7;
`;

export type TextResult = {
    id: string;
    value: string;
};

function generateFormData(file: File): FormData {
    const uploadHeaders = new Headers();
    uploadHeaders.append('Content-Type', 'multipart/form-data');
    uploadHeaders.append('Accept', 'application/json');
    const data = new FormData();
    data.append('my_photo', file);
    return data;
}

type TagPhotoRecognitionProps = {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    tagOcrEndpoint: string;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const TagPhotoRecognition = ({
    setQuery,
    tagOcrEndpoint,
    setSnackbarText,
}: TagPhotoRecognitionProps): JSX.Element => {
    const [showTagSelectionModal, setShowTagSelectionModal] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState<TextResult[]>([]);
    const [ocrStatus, setOcrStatus] = useState(AsyncStatus.INACTIVE);
    const captureImageInputRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );

    const onCapture = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const currentFiles = e.currentTarget.files;
        if (!currentFiles) return;
        const data = generateFormData(currentFiles[0]);
        setOcrStatus(AsyncStatus.LOADING);
        setShowTagSelectionModal(true);
        try {
            const response = await postByFetchSimple(tagOcrEndpoint, data);
            setSuggestedTags(response.data);
            if (response.data.length < 1) {
                setOcrStatus(AsyncStatus.EMPTY_RESPONSE);
            } else {
                setOcrStatus(AsyncStatus.SUCCESS);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setOcrStatus(AsyncStatus.ERROR);
        }
        captureImageInputRef.current.files = null;
    };

    return (
        <>
            <CaptureInput
                type="file"
                onChange={onCapture}
                accept="image/*"
                capture="environment"
                ref={captureImageInputRef}
            />
            <CaptureButton
                variant={'ghost_icon'}
                onClick={(): void => captureImageInputRef.current.click()}
            >
                <EdsIcon name="camera_add_photo" />
            </CaptureButton>
            {showTagSelectionModal ? (
                <TagSelectionModal
                    setShowTagSelectionModal={setShowTagSelectionModal}
                    suggestedTags={suggestedTags}
                    setSuggestedTags={setSuggestedTags}
                    setQuery={setQuery}
                    ocrStatus={ocrStatus}
                />
            ) : null}
        </>
    );
};

export default TagPhotoRecognition;
