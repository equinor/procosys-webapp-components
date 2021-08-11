import React from 'react';
import { Button } from '@equinor/eds-core-react';

const ReloadButton = (): JSX.Element => {
    return (
        <Button onClick={(): void => window.location.reload()}>Reload</Button>
    );
};

export default ReloadButton;
