import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@equinor/eds-core-react';


const HomeButton = (): JSX.Element => {
    const history = useHistory();
    return <Button onClick={(): void => history.push('')}>Home</Button>;
}

export default HomeButton;
