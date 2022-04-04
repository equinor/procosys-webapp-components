import React, { useEffect, useState, useMemo } from 'react';
import {
    Attachment,
    CheckItem,
    ChecklistDetails,
    CustomCheckItem,
    LoopTag,
} from '../../typings/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import styled from 'styled-components';
import axios from 'axios';
import { Banner } from '@equinor/eds-core-react';
import procosysApiService from '../../services/procosysApi';
import baseApi, { ProcosysApiSettings } from '../../services/baseApi';
import CustomCheckItems from './CheckItems/CustomCheckItems';
import CheckAllButton from './CheckItems/CheckAllButton';
import AsyncPage from '../../components/AsyncPage';
import Attachments from '../Attachments/Attachments';
import LoopTags from './LoopTags';
import { AsyncStatus } from '../../typings/enums';

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

const AttachmentsWrapper = styled.div`
    padding: 16px 4%;
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initializeApi = ({
    checklistId,
    plantId,
    getAccessToken,
    apiSettings,
}: ChecklistProps) => {
    const axiosInstance = baseApi({ getAccessToken, apiSettings });
    return procosysApiService({
        axios: axiosInstance,
        apiVersion: apiSettings.apiVersion,
        plantId,
        checklistId,
    });
};

const Checklist = (props: ChecklistProps): JSX.Element => {
    const api = useMemo(
        () => initializeApi({ ...props }),
        [props.checklistId, props.plantId]
    );
    const [fetchChecklistStatus, setFetchChecklistStatus] = useState(
        AsyncStatus.LOADING
    );
    const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
    const [customCheckItems, setCustomCheckItems] = useState<CustomCheckItem[]>(
        []
    );
    const [loopTags, setLoopTags] = useState<LoopTag[]>([]);
    const [multiSignOrVerifyIsOpen, setMultiSignOrVerifyIsOpen] =
        useState(false);
    const [checklistDetails, setChecklistDetails] =
        useState<ChecklistDetails>();
    const [isSigned, setIsSigned] = useState(false);
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(true);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const source = axios.CancelToken.source();

    useEffect(() => {
        setAllItemsCheckedOrNA(
            determineIfAllAreCheckedOrNA(checkItems, customCheckItems)
        );
    }, [checkItems, customCheckItems]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const checklistResponse = await api.getChecklist(source.token);
                setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                setCheckItems(checklistResponse.checkItems);
                setCustomCheckItems(checklistResponse.customCheckItems);
                setChecklistDetails(checklistResponse.checkList);
                setLoopTags(checklistResponse.loopTags);
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
        <AsyncPage
            fetchStatus={fetchChecklistStatus}
            errorMessage={'Unable to get checklist.'}
            loadingMessage={''}
        >
            <>
                {!multiSignOrVerifyIsOpen && (
                    <>
                        {loopTags.length > 0 && (
                            <LoopTags loopTags={loopTags} />
                        )}
                        {!isSigned && !allItemsCheckedOrNA
                            ? null
                            : isSigned && (
                                  <Banner>
                                      <Banner.Message>
                                          This checklist is signed. Unsign to
                                          make changes.
                                      </Banner.Message>
                                  </Banner>
                              )}
                        {checklistDetails ? (
                            <ChecklistWrapper>
                                {!isSigned && (
                                    <CheckAllButton
                                        setSnackbarText={props.setSnackbarText}
                                        allItemsCheckedOrNA={
                                            allItemsCheckedOrNA
                                        }
                                        checkItems={checkItems}
                                        customCheckItems={customCheckItems}
                                        setCheckItems={setCheckItems}
                                        setCustomCheckItems={
                                            setCustomCheckItems
                                        }
                                        api={api}
                                    />
                                )}
                                <CheckItems
                                    setCheckItems={setCheckItems}
                                    checkItems={checkItems}
                                    isSigned={isSigned}
                                    setSnackbarText={props.setSnackbarText}
                                    api={api}
                                />
                                <CustomCheckItems
                                    customCheckItems={customCheckItems}
                                    setCustomCheckItems={setCustomCheckItems}
                                    isSigned={isSigned}
                                    setSnackbarText={props.setSnackbarText}
                                    api={api}
                                />
                            </ChecklistWrapper>
                        ) : null}
                        <AttachmentsHeader>Attachments</AttachmentsHeader>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={(): Promise<Attachment[]> =>
                                    api.getChecklistAttachments(source.token)
                                }
                                getAttachment={(
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    api.getChecklistAttachment(
                                        source.token,
                                        attachmentId
                                    )
                                }
                                postAttachment={(
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    api.postChecklistAttachment(file, title)
                                }
                                deleteAttachment={(
                                    attachmentId: number
                                ): Promise<void> =>
                                    api.deleteChecklistAttachment(attachmentId)
                                }
                                setSnackbarText={props.setSnackbarText}
                                readOnly={isSigned}
                                source={source}
                            />
                        </AttachmentsWrapper>
                    </>
                )}

                {checklistDetails && (
                    <ChecklistSignature
                        setSnackbarText={props.setSnackbarText}
                        reloadChecklist={setReloadChecklist}
                        allItemsCheckedOrNA={allItemsCheckedOrNA}
                        isSigned={isSigned}
                        details={checklistDetails}
                        setIsSigned={setIsSigned}
                        api={api}
                        setMultiSignOrVerifyIsOpen={setMultiSignOrVerifyIsOpen}
                        multiSignOrVerifyIsOpen={multiSignOrVerifyIsOpen}
                        refreshChecklistStatus={props.refreshChecklistStatus}
                    />
                )}
            </>
        </AsyncPage>
    );
};

export default Checklist;
