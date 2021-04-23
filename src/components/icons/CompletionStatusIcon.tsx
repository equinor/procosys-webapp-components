import greyStatus from '../../assets/img/scopeStatusGrey.png';
import greenStatus from '../../assets/img/status/ok.svg';
import paStatus from '../../assets/img/scopeStatusPa.png';
import pbStatus from '../../assets/img/scopeStatusPb.png';
import React from 'react';
import { CompletionStatus } from '../../services/apiTypes';

type CompletionStatusIconProps = {
    status: CompletionStatus;
};

const CompletionStatusIcon = ({
    status,
}: CompletionStatusIconProps): JSX.Element => {
    if (status === CompletionStatus.OS) {
        return <img src={greyStatus} alt="OS" />;
    }
    if (status === CompletionStatus.OK) {
        return <img src={greenStatus} alt="OK" />;
    }
    if (status === CompletionStatus.PA) {
        return <img src={paStatus} alt="PA" />;
    }
    if (status === CompletionStatus.PB) {
        return <img src={pbStatus} alt="PB" />;
    }
    return <></>;
};

export default CompletionStatusIcon;
