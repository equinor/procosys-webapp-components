import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@equinor/eds-core-react';
import clearHomePlantAndProject from '../../utils/clearHomePlantAndProject';

const HomeButton = (): JSX.Element => {
    const history = useHistory();
    const handleHomeClick = (): void => {
        clearHomePlantAndProject();
        history.push('');
    };
    return <Button onClick={handleHomeClick}>Home</Button>;
};

export default HomeButton;
