import React, { useEffect, useState, useMemo } from 'react';
import {
    AsyncStatus,
    CheckItem,
    ChecklistDetails,
    CustomCheckItem,
} from '../services/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import styled from 'styled-components';
import EdsIcon from '../components/icons/EdsIcon';
import axios, { CancelToken } from 'axios';
import Attachment, {
    AttachmentsWrapper,
    UploadImageButton,
} from '../components/Attachment';
import UploadAttachment from '../components/UploadAttachment';
import useAttachments from '../utils/useAttachments';
import buildEndpoint from '../utils/buildEndpoint';
import { Banner } from '@equinor/eds-core-react';
import procosysApiService from '../services/procosysApi';
import baseApi, { ProcosysApiSettings } from '../services/baseApi';
import CustomCheckItems from './CheckItems/CustomCheckItems';
import CheckAllButton from './CheckItems/CheckAllButton';

const { BannerIcon, BannerMessage } = Banner;

const ChecklistWrapper = styled.div`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
`;

const AttachmentsHeader = styled.h5`
    margin-top: 54px;
    margin-left: 4%;
    margin-bottom: 0px;
`;

const determineIfAllAreCheckedOrNA = (
    checkItemsToDetermine: CheckItem[],
    customCheckItemsToDetermine: CustomCheckItem[]
): boolean => {
    return (
        checkItemsToDetermine.every(
            (item) => item.isOk || item.isNotApplicable
        ) && customCheckItemsToDetermine.every((item) => item.isOk)
    );
};

type ChecklistProps = {
    checklistId: string;
    plantId: string;
    apiSettings: ProcosysApiSettings;
    refreshChecklistStatus: React.Dispatch<React.SetStateAction<boolean>>;
    getAccessToken: (scope: string[]) => Promise<string>;
    setSnackbarText: (message: string) => void;
};

const initializeApi = ({
    checklistId,
    plantId,
    getAccessToken,
    apiSettings,
}: ChecklistProps) => {
    const axiosInstance = baseApi({ getAccessToken, apiSettings });
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
    const [fetchChecklistStatus, setFetchChecklistStatus] = useState(
        AsyncStatus.LOADING
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [customCheckItems, setCustomCheckItems] = useState<CustomCheckItem[]>(
        []
    );
    const [checklistDetails, setChecklistDetails] =
        useState<ChecklistDetails>();
    const [isSigned, setIsSigned] = useState(false);
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(true);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const source = axios.CancelToken.source();

    useEffect(() => {
        setAllItemsCheckedOrNA(
            determineIfAllAreCheckedOrNA(checkItems, customCheckItems)
        );
        console.log(
            'all items checked: ',
            determineIfAllAreCheckedOrNA(checkItems, customCheckItems)
        );
    }, [checkItems, customCheckItems]);

    useEffect(() => {
        props.refreshChecklistStatus((prev: boolean) => !prev);
    }, [isSigned]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const checklistResponse = await api.getChecklist();
                setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                setCheckItems(checklistResponse.checkItems);
                setCustomCheckItems(checklistResponse.customCheckItems);
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

    return (
        <>
            {!isSigned && !allItemsCheckedOrNA
                ? null
                : isSigned && (
                      <Banner>
                          <BannerIcon variant={'info'}>
                              <EdsIcon name={'info_circle'} />
                          </BannerIcon>
                          <BannerMessage>
                              This checklist is signed. Unsign to make changes.
                          </BannerMessage>
                      </Banner>
                  )}
            {checklistDetails ? (
                <ChecklistWrapper>
                    {!isSigned && (
                        <CheckAllButton
                            setSnackbarText={props.setSnackbarText}
                            allItemsCheckedOrNA={allItemsCheckedOrNA}
                            checkItems={checkItems}
                            customCheckItems={customCheckItems}
                            setCheckItems={setCheckItems}
                            setCustomCheckItems={setCustomCheckItems}
                            api={api}
                        />
                    )}
                    <CheckItems
                        setCheckItems={setCheckItems}
                        allItemsCheckedOrNA={allItemsCheckedOrNA}
                        checkItems={checkItems}
                        isSigned={isSigned}
                        setSnackbarText={props.setSnackbarText}
                        api={api}
                    />
                    <CustomCheckItems
                        setCustomCheckItems={setCustomCheckItems}
                        customCheckItems={customCheckItems}
                        isSigned={isSigned}
                        setSnackbarText={props.setSnackbarText}
                        api={api}
                    />
                </ChecklistWrapper>
            ) : null}
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
                        setSnackbarText={props.setSnackbarText}
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
                        setSnackbarText={props.setSnackbarText}
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

            {checklistDetails ? (
                <ChecklistSignature
                    setSnackbarText={props.setSnackbarText}
                    reloadChecklist={setReloadChecklist}
                    allItemsCheckedOrNA={allItemsCheckedOrNA}
                    isSigned={isSigned}
                    details={checklistDetails}
                    setIsSigned={setIsSigned}
                    api={api}
                />
            ) : null}
        </>
    );
};

export default Checklist;
