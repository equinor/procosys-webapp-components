import React, { useEffect, useState, useMemo } from 'react';
import { AsyncStatus, CheckItem, ChecklistDetails } from '../services/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import ChecklistDetailsCard from './ChecklistDetailsCard';
import styled from 'styled-components';
import EdsIcon from '../components/icons/EdsIcon';
import axios, { CancelToken } from 'axios';
import AsyncCard from '../components/AsyncCard';
import Attachment, {
    AttachmentsWrapper,
    UploadImageButton,
} from '../components/Attachment';
import UploadAttachment from '../components/UploadAttachment';
import { CardWrapper } from '../components/EdsCard';
import useAttachments from '../utils/useAttachments';
import buildEndpoint from '../utils/buildEndpoint';
import useSnackbar from '../utils/useSnackbar';
import AsyncPage from '../components/AsyncPage';
import { Banner } from '@equinor/eds-core-react';
import procosysApiService from '../services/procosysApi';
import baseApi from '../services/baseApi';

const { BannerIcon, BannerMessage } = Banner;

const ChecklistWrapper = styled.div`
    padding: 0 4%;
`;

const AttachmentsHeader = styled.h5`
    margin-top: 54px;
    margin-left: 4%;
    margin-bottom: 0px;
`;

type ChecklistProps = {
    checklistId: string;
    plantId: string;
    accessToken: string;
    baseUrl: string;
};

const initializeApi = ({
    checklistId,
    plantId,
    accessToken,
    baseUrl,
}: ChecklistProps) => {
    const axiosInstance = baseApi({ accessToken, baseUrl });
    return procosysApiService({
        axios: axiosInstance,
        apiVersion: '&api-version=4.1',
        plantId,
        checklistId,
    });
};

const Checklist = (props: ChecklistProps): JSX.Element => {
    const api = useMemo(
        () => initializeApi({ ...props }),
        [props.checklistId, props.plantId]
    );
    const getAttachmentsEndpoint = buildEndpoint().getChecklistAttachments(
        props.plantId,
        props.checklistId
    );
    const {
        refreshAttachments: setRefreshAttachments,
        attachments,
        fetchAttachmentsStatus,
    } = useAttachments(getAttachmentsEndpoint, api);
    const { snackbar, setSnackbarText } = useSnackbar();
    const [fetchChecklistStatus, setFetchChecklistStatus] = useState(
        AsyncStatus.LOADING
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [checklistDetails, setChecklistDetails] =
        useState<ChecklistDetails>();
    const [isSigned, setIsSigned] = useState(false);
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(true);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const source = axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const checklistResponse = await api.getChecklist();
                setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                setCheckItems(checklistResponse.checkItems);
                setChecklistDetails(checklistResponse.checkList);
                setFetchChecklistStatus(AsyncStatus.SUCCESS);
            } catch (err) {
                setFetchChecklistStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel('Checklist component unmounted');
        };
    }, [reloadChecklist, api]);

    const content = (): JSX.Element => {
        if (!checklistDetails) return <></>;
        return (
            <>
                <ChecklistDetailsCard details={checklistDetails} />
                {!isSigned && !allItemsCheckedOrNA
                    ? null
                    : isSigned && (
                          <Banner>
                              <BannerIcon variant={'info'}>
                                  <EdsIcon name={'info_circle'} />
                              </BannerIcon>
                              <BannerMessage>
                                  This checklist is signed. Unsign to make
                                  changes.
                              </BannerMessage>
                          </Banner>
                      )}
                <ChecklistWrapper>
                    <CheckItems
                        setAllItemsCheckedOrNA={setAllItemsCheckedOrNA}
                        allItemsCheckedOrNA={allItemsCheckedOrNA}
                        checkItems={checkItems}
                        details={checklistDetails}
                        isSigned={isSigned}
                        setSnackbarText={setSnackbarText}
                        api={api}
                    />
                </ChecklistWrapper>
                <AttachmentsHeader>Attachments</AttachmentsHeader>
                <AttachmentsWrapper>
                    <UploadImageButton
                        disabled={isSigned}
                        onClick={(): void => setShowUploadModal(true)}
                    >
                        <EdsIcon name="camera_add_photo" />
                    </UploadImageButton>
                    {showUploadModal ? (
                        <UploadAttachment
                            setShowModal={setShowUploadModal}
                            setSnackbarText={setSnackbarText}
                            updateAttachments={setRefreshAttachments}
                            api={api}
                        />
                    ) : null}
                    {attachments.map((attachment) => (
                        <Attachment
                            key={attachment.id}
                            isSigned={isSigned}
                            getAttachment={(
                                cancelToken: CancelToken
                            ): Promise<Blob> =>
                                api.getChecklistAttachment(
                                    cancelToken,
                                    attachment.id
                                )
                            }
                            setSnackbarText={setSnackbarText}
                            attachment={attachment}
                            refreshAttachments={setRefreshAttachments}
                            deleteAttachment={(
                                cancelToken: CancelToken
                            ): Promise<void> =>
                                api.deleteChecklistAttachment(
                                    cancelToken,
                                    attachment.id
                                )
                            }
                        />
                    ))}
                </AttachmentsWrapper>
                <ChecklistSignature
                    setSnackbarText={setSnackbarText}
                    reloadChecklist={setReloadChecklist}
                    allItemsCheckedOrNA={allItemsCheckedOrNA}
                    isSigned={isSigned}
                    details={checklistDetails}
                    setIsSigned={setIsSigned}
                    api={api}
                />
            </>
        );
    };

    return (
        <>
            {content()}
            {snackbar}
        </>
    );
};

export default Checklist;
