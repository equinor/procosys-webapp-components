import React from 'react';
import { Button } from '@equinor/eds-core-react';
import clearHomePlantAndProject from '../../utils/clearHomePlantAndProject';

function getCurrentApp(): string {
    const url = window.location.href;
    if (url.includes('/mc')) return 'mc';
    if (url.includes('/comm')) return 'comm';
    return '';
}

const HomeButton = (): JSX.Element => {
    const handleHomeClick = (): void => {
        clearHomePlantAndProject();
        window.location.href = window.location.origin + '/' + getCurrentApp();
    };
    return <Button onClick={handleHomeClick}>Home</Button>;
};

export default HomeButton;
