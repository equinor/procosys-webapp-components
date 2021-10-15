import { Button } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../style/GlobalStyles';
import { TextResult } from './TagPhotoRecognition';
import PageHeader from '../components/PageHeader';
import { AsyncStatus } from '../typings/enums';

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

function determineModalTitle(status: AsyncStatus): string {
    if (status === AsyncStatus.ERROR) return 'An error occured';
    if (status === AsyncStatus.EMPTY_RESPONSE) return 'No tags recognised';
    if (status === AsyncStatus.LOADING) return 'Processing image...';
    return 'Select your tag';
}

function determineModalSubtitle(status: AsyncStatus): string {
    if (status === AsyncStatus.ERROR)
        return 'Please try again or enter tag number manually';
    if (status === AsyncStatus.EMPTY_RESPONSE)
        return 'Please try again or enter tag number manually';
    if (status === AsyncStatus.LOADING)
        return 'This should only take a short while.';
    return 'If you cannot see your tag, please try again or enter tag manually.';
}

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

    return (
        <SelectTagWrapper>
            <PageHeader
                title={determineModalTitle(ocrStatus)}
                subtitle={determineModalSubtitle(ocrStatus)}
            />
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
