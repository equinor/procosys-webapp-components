import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { AsyncStatus } from '../../typings/enums';
import handleDownload from '../../utils/handleDownload';
import ActionButton from '../../components/buttons/ActionButton';

export const ModalActionPanel = styled.div`
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
`;

type ActionsPanelProps = {
    attachmentFileURL: string;
    fileName: string;
    setSnackbarText: (message: string) => void;
    readOnly: boolean;
    deleteStatus: AsyncStatus;
    setShowFullScreenImage: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete?: () => Promise<void>;
};

const ActionsPanel = ({
    attachmentFileURL,
    fileName,
    setSnackbarText,
    readOnly,
    deleteStatus,
    setShowFullScreenImage,
    handleDelete,
}: ActionsPanelProps): JSX.Element => {
    return (
        <ModalActionPanel>
            <ActionButton
                onClick={(): void => {
                    setSnackbarText('Attachment successfully downloaded.');
                    handleDownload(attachmentFileURL, fileName);
                }}
                icon={<EdsIcon name="cloud_download" />}
                label={'Download'}
            />
            {readOnly || !handleDelete ? null : (
                <ActionButton
                    onClick={handleDelete}
                    icon={
                        <EdsIcon
                            name="delete_to_trash"
                            alt="Delete attachment"
                        />
                    }
                    label={
                        deleteStatus === AsyncStatus.LOADING
                            ? 'Deleting...'
                            : 'Delete'
                    }
                />
            )}
            <ActionButton
                onClick={(): void => setShowFullScreenImage(false)}
                icon={<EdsIcon name="close" />}
                label={'Close'}
            />
        </ModalActionPanel>
    );
};

export default ActionsPanel;
