import { Button } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../services/apiTypes';
import { COLORS } from '../style/GlobalStyles';
import { TextResult } from './TagPhotoRecognition';
import PageHeader from '../components/PageHeader';

const CloseButton = styled(Button)`
    margin-bottom: 50px;
    margin-right: 4%;
    align-self: flex-end;
`;

const SelectorButton = styled.a`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 16px 4%;
    margin: 0 10px;
    position: relative;
    & p {
        margin: 0 30px 0 0;
    }
    &:hover {
        background-color: ${COLORS.fadedBlue};
    }
`;

const SelectTagWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background-color: ${COLORS.white};
    z-index: 300;
    overflow: auto;
    & ${SelectorButton} {
        border-radius: 0;
    }
`;

type TagSelectionModalProps = {
    setShowTagSelectionModal: React.Dispatch<React.SetStateAction<boolean>>;
    suggestedTags: TextResult[];
    setSuggestedTags: React.Dispatch<React.SetStateAction<TextResult[]>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    ocrStatus: AsyncStatus;
};

const TagSelectionModal = ({
    setShowTagSelectionModal,
    suggestedTags,
    setSuggestedTags,
    setQuery,
    ocrStatus,
}: TagSelectionModalProps): JSX.Element => {
    const handleSelectClick = (textResultValue: string): void => {
        setQuery(textResultValue);
        closeModal();
    };

    const closeModal = (): void => {
        setSuggestedTags([]);
        setShowTagSelectionModal(false);
    };

    const determineModalHeader = (ocrStatus: AsyncStatus): JSX.Element => {
        if (ocrStatus === AsyncStatus.ERROR) {
            return (
                <PageHeader
                    title="An error occured"
                    subtitle="Please try again or enter tag number manually"
                />
            );
        } else if (ocrStatus === AsyncStatus.EMPTY_RESPONSE) {
            return (
                <PageHeader
                    title="No tags recognised"
                    subtitle="Please try again or enter tag number manually"
                />
            );
        } else if (ocrStatus === AsyncStatus.LOADING) {
            return (
                <PageHeader
                    title="Processing image..."
                    subtitle="This should only take a few seconds."
                />
            );
        } else {
            return (
                <PageHeader
                    title="Select your tag"
                    subtitle="If you cannot see your tag, please try again or enter tag manually."
                />
            );
        }
    };

    return (
        <SelectTagWrapper>
            {determineModalHeader(ocrStatus)}
            {suggestedTags.map((tag) => (
                <SelectorButton
                    role={'button'}
                    key={tag.id}
                    onClick={(): void => handleSelectClick(tag.value)}
                >
                    {tag.value}
                </SelectorButton>
            ))}
            <CloseButton onClick={closeModal}>Close</CloseButton>
        </SelectTagWrapper>
    );
};

export default TagSelectionModal;
