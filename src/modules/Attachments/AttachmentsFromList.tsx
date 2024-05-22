import React from 'react';
import {
    Attachment as AttachmentType,
    AttachmentInList,
} from '../../typings/apiTypes';
import Attachment from './Attachment';
import { AttachmentsWrapper } from './Attachments';

interface AttachmentsFromListProps {
    attachments: AttachmentInList[];
    getAttachment: (
        attachmentId: string,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    setSnackbarText: (message: string) => void;
    postAttachment?: (file: FormData, title: string) => Promise<void>;
    deleteAttachment?: (attachmentId: number) => Promise<void>;
    abortController?: AbortController;
}

const AttachmentsFromList = (props: AttachmentsFromListProps): JSX.Element => {
    return (
        <AttachmentsWrapper>
            {props.attachments.map((attachment) => (
                <Attachment
                    key={attachment.guid}
                    readOnly={true}
                    getAttachment={(abortSignal?: AbortSignal): Promise<Blob> =>
                        props.getAttachment(`${attachment.guid}`, abortSignal)
                    }
                    setSnackbarText={props.setSnackbarText}
                    attachment={attachment}
                    abortController={props.abortController}
                />
            ))}
        </AttachmentsWrapper>
    );
};

export default AttachmentsFromList;
