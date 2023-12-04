import { Button } from '@equinor/eds-core-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import removeSubdirectories from '../../utils/removeSubdirectories';
import EdsIcon from '../icons/EdsIcon';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import { NavButton } from '../NavBar';

type BackButtonProps = {
    to?: string;
};

const BackButton = ({ to }: BackButtonProps): JSX.Element => {
    const history = useHistory();
    const { pathname } = useLocation();
    return (
        <NavButton
            variant="ghost"
            onClick={(): void => {
                if (to) {
                    history.push(to);
                } else {
                    history.push(removeSubdirectories(pathname, 1));
                }
            }}
        >
            <EdsIcon name={'arrow_back'} title="Back" />
            Back
        </NavButton>
    );
};

export default BackButton;
