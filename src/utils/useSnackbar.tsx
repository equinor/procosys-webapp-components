import React, { useEffect, useState } from 'react';
import { Snackbar as EdsSnackbar } from '@equinor/eds-core-react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useSnackbar = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const snackbar = (
        <EdsSnackbar
            autoHideDuration={3000}
            onClose={(): void => {
                setShowSnackbar(false);
                setSnackbarText('');
            }}
            open={showSnackbar}
        >
            {snackbarText}
        </EdsSnackbar>
    );

    useEffect(() => {
        if (snackbarText.length < 1) return;
        setShowSnackbar(true);
    }, [snackbarText]);

    return {
        setSnackbarText,
        snackbar,
    };
};

export default useSnackbar;
