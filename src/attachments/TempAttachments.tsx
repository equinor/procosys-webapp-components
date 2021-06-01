import React from 'react';

type AttachmentsProps = {
    setSnackbarText: (message: string) => void;
    tempAttachmentIds?: string[];
    postAttachment: (formData: string) => Promise<string>;
};

const Attachments = ({ postAttachment }: AttachmentsProps) => {
    return <div></div>;
};

export default Attachments;
