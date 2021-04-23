import React from 'react';
import { CompletionStatus } from '../../services/apiTypes';
import leftGrey from '../../assets/img/status/left_grey.png';
import leftYellow from '../../assets/img/status/left_yellow.png';
import leftGreen from '../../assets/img/status/left_green.png';
import leftRed from '../../assets/img/status/left_red.png';
import rightYellow from '../../assets/img/status/right_yellow.png';
import rightGrey from '../../assets/img/status/right_grey.png';
import rightGreen from '../../assets/img/status/right_green.png';
import rightRed from '../../assets/img/status/right_red.png';

type PackageStatusIconProps = {
    mcStatus: CompletionStatus;
    commStatus: CompletionStatus;
};

const determineCommImage = (status: CompletionStatus): string => {
    if (status === CompletionStatus.OS) return leftGrey;
    if (status === CompletionStatus.PA) return leftRed;
    if (status === CompletionStatus.PB) return leftYellow;
    if (status === CompletionStatus.OK) return leftGreen;
    return '';
};

const determineMCImage = (status: CompletionStatus): string => {
    if (status === CompletionStatus.OS) return rightGrey;
    if (status === CompletionStatus.PA) return rightRed;
    if (status === CompletionStatus.PB) return rightYellow;
    if (status === CompletionStatus.OK) return rightGreen;
    return '';
};

export const PackageStatusIcon = ({
    mcStatus,
    commStatus,
}: PackageStatusIconProps): JSX.Element => {
    return (
        <>
            <img
                src={determineCommImage(commStatus)}
                alt={'Comm package status indicator, left side'}
            />
            <img
                src={determineMCImage(mcStatus)}
                alt={'MC package status indicator, right side'}
            />
        </>
    );
};
