import Axios from 'axios';
import { useEffect, useState } from 'react';
import { AsyncStatus } from '../contexts/CommAppContext';
import { Attachment } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useAttachments = (endpoint: string) => {
    const { api } = useCommonHooks();
    const [refreshAttachments, setRefreshAttachments] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [fetchAttachmentsStatus, setFetchAttachmentsStatus] = useState(
        AsyncStatus.LOADING
    );
    const source = Axios.CancelToken.source();
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const attachmentsFromApi = await api.getAttachments(
                    source.token,
                    endpoint
                );
                setFetchAttachmentsStatus(AsyncStatus.SUCCESS);
                setAttachments(attachmentsFromApi);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchAttachmentsStatus(AsyncStatus.ERROR);
                }
            }
        })();
        return (): void => source.cancel();
    }, [api, refreshAttachments, endpoint]);

    return {
        fetchAttachmentsStatus,
        setFetchAttachmentsStatus,
        showUploadModal,
        setShowUploadModal,
        attachments,
        refreshAttachments: setRefreshAttachments,
    };
};

export default useAttachments;
