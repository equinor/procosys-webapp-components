import React from 'react';
import { Attachment } from '../services/apiTypes';

type AttachmentsProps = {
    getAttachments?: () => Promise<Attachment[]>;
    tempAttachmentIds?: string[];
    postAttachment:
        | ((formData: string) => Promise<string>)
        | ((formData: string) => Promise<void>);
};

const Attachments = ({ postAttachment }: AttachmentsProps) => {
    return <div></div>;
};

export default Attachments;
