import { Button } from '@equinor/eds-core-react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import removeSubdirectories from '../../utils/removeSubdirectories';
import EdsIcon from '../icons/EdsIcon';

type BackButtonProps = {
    to?: string;
};

const BackButton = ({ to }: BackButtonProps): JSX.Element => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (
        <Button
            variant="ghost"
            onClick={(): void => {
                if (to) {
                    navigate(to);
                } else {
                    navigate(removeSubdirectories(pathname, 1));
                }
            }}
        >
            <EdsIcon name={'arrow_back'} title="Back" />
            Back
        </Button>
    );
};

export default BackButton;
