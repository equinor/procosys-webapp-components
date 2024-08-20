import { Button } from '@equinor/eds-core-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { postByFetchSimple } from '../../services/apiHelpers';
import { AsyncStatus } from '../../typings/enums';
import TagSelectionModal from './TagSelectionModal';

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

    const onCapture = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const currentFiles = e.currentTarget.files;
        if (!currentFiles) return;
    
        const image = new Image();
        const file = currentFiles[0];
    
        image.src = URL.createObjectURL(file);
        image.onload = async () => {
            const width = image.width;
            const height = image.height;
    
            if (width < 50 || height < 50 || width > 10000 || height > 10000) {
                setSnackbarText('The image size is incorrect. The minimum size is 50x50 pixels, and the maximum size is 10000x10000 pixels.');
                captureImageInputRef.current.value = ''; 
                return;
            }
    
            const data = generateFormData(file);
            setOcrStatus(AsyncStatus.LOADING);
            setShowTagSelectionModal(true);
            try {
                const response = await postByFetchSimple(tagOcrEndpoint, data);
                if (Array.isArray(response)) {
                    setSuggestedTags(response);
                    if (response.length < 1) {
                        setOcrStatus(AsyncStatus.EMPTY_RESPONSE);
                    } else {
                        setOcrStatus(AsyncStatus.SUCCESS);
                    }
                } else {
                    console.error('Unexpected response format:', response);
                    setOcrStatus(AsyncStatus.ERROR);
                }
            } catch (error) {
                if (!(error instanceof Error)) return;
                setSnackbarText(error.message);
                setOcrStatus(AsyncStatus.ERROR);
            }
            captureImageInputRef.current.value = ''; 
        };
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
