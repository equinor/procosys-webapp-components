import { Button } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import ProcosysLogo from '../../assets/img/ProCoSys_icon.svg';
import { NavButton } from '../NavBar';

const ProcosysIcon = styled.img`
    width: 18px;
    object-fit: contain;
`;

const ProcosysButton = (): JSX.Element => {
    return (
        <NavButton variant="ghost">
            <ProcosysIcon src={ProcosysLogo} />
            ProCoSys
        </NavButton>
    );
};

export default ProcosysButton;
