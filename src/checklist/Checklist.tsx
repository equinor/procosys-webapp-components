import React, { useEffect, useState } from 'react';
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
import procosysApiService, {
    ProcosysApiService,
} from '../services/procosysApi';
import baseApi from '../services/baseApi';

const { BannerIcon, BannerMessage } = Banner;

const ChecklistWrapper = styled.div`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 55px);
    & > ${CardWrapper}:first-of-type {
        margin-top: 50px;
    }
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
    const [api, setApi] = useState(initializeApi({ ...props }));
    const getAttachmentsEndpoint = buildEndpoint().getChecklistAttachments(
        props.plantId,
        props.checklistId
    );
    const {
        refreshAttachments: setRefreshAttachments,
        attachments,
        fetchAttachmentsStatus,
    } = useAttachments(getAttachmentsEndpoint);
    const { snackbar, setSnackbarText } = useSnackbar();
    const [fetchChecklistStatus, setFetchChecklistStatus] = useState(
        AsyncStatus.LOADING
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [
        checklistDetails,
        setChecklistDetails,
    ] = useState<ChecklistDetails>();
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
                <ChecklistDetailsCard
                    details={checklistDetails}
                    isSigned={isSigned}
                    descriptionLabel={'checklist'}
                />
                {isSigned && (
                    <Banner>
                        <BannerIcon variant={'info'}>
                            <EdsIcon name={'info_circle'} />
                        </BannerIcon>
                        <BannerMessage>
                            This checklist is signed. Unsign to make changes.
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
                    />
                    <AsyncCard
                        errorMessage={
                            'Unable to load attachments for this checklist.'
                        }
                        cardTitle={'Attachments'}
                        fetchStatus={fetchAttachmentsStatus}
                    >
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
                                    postAttachment={api.postChecklistAttachment}
                                    parentId={props.checklistId}
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
                    </AsyncCard>

                    <AsyncCard
                        fetchStatus={fetchChecklistStatus}
                        errorMessage={'Unable to load checklist signature.'}
                        cardTitle={'Signature'}
                    >
                        <ChecklistSignature
                            setSnackbarText={setSnackbarText}
                            reloadChecklist={setReloadChecklist}
                            allItemsCheckedOrNA={allItemsCheckedOrNA}
                            isSigned={isSigned}
                            details={checklistDetails}
                            setIsSigned={setIsSigned}
                        />
                    </AsyncCard>
                    {!isSigned && !allItemsCheckedOrNA && (
                        <Banner>
                            <BannerIcon variant={'warning'}>
                                <EdsIcon name={'warning_outlined'} />
                            </BannerIcon>
                            <BannerMessage>
                                All applicable items must be checked before
                                signing.
                            </BannerMessage>
                        </Banner>
                    )}
                </ChecklistWrapper>
            </>
        );
    };

    return (
        <>
            <AsyncPage
                fetchStatus={fetchChecklistStatus}
                errorMessage={
                    'Unable to load checklist. Please reload or try again later.'
                }
                loadingMessage={'Loading checklist'}
            >
                {content()}
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default Checklist;
