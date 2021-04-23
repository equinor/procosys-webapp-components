import { Variants } from '@equinor/eds-core-react/dist/types/components/TextField/types';
import React from 'react';
import EdsIcon from '../components/icons/EdsIcon';
import { AsyncStatus } from '../contexts/CommAppContext';
import { COLORS } from '../style/GlobalStyles';

export const determineVariant = (status: AsyncStatus): Variants => {
    if (status === AsyncStatus.ERROR) return 'error';
    if (status === AsyncStatus.SUCCESS) return 'success';
    return 'default';
};

export const determineHelperText = (status: AsyncStatus): string => {
    if (status === AsyncStatus.ERROR) return 'Unable to save comment.';
    if (status === AsyncStatus.SUCCESS) return 'Comment saved.';
    if (status === AsyncStatus.LOADING) return 'Saving.';
    return '';
};
