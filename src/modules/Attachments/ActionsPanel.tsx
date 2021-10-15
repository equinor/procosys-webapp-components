import { Menu, Typography } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { AsyncStatus } from '../../typings/enums';
import handleDownload from '../../utils/handleDownload';

export const ModalActionPanel = styled.div`
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
    & > li,
    & > li:hover {
        list-style-type: none;
        background: none;
    }
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
            <Menu.Item
                onClick={(): void => {
                    setSnackbarText('Attachment successfully downloaded.');
                    handleDownload(attachmentFileURL, fileName);
                }}
            >
                <EdsIcon name="cloud_download" />
                <Typography group="navigation" variant="menu_title" as="span">
                    Download
                </Typography>
            </Menu.Item>
            {readOnly || !handleDelete ? null : (
                <Menu.Item color={'danger'} onClick={handleDelete}>
                    <EdsIcon name="delete_to_trash" alt="Delete attachment" />
                    {deleteStatus === AsyncStatus.LOADING
                        ? 'Deleting...'
                        : 'Delete'}
                </Menu.Item>
            )}
            <Menu.Item onClick={(): void => setShowFullScreenImage(false)}>
                <EdsIcon name="close" />
                <Typography group="navigation" variant="menu_title" as="span">
                    Close
                </Typography>
            </Menu.Item>
        </ModalActionPanel>
    );
};

export default ActionsPanel;
