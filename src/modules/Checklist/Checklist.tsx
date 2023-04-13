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
import CustomCheckItems from './CheckItems/CustomCheckItems';
import CheckAllButton from './CheckItems/CheckAllButton';
import AsyncPage from '../../components/AsyncPage';
import Attachments from '../Attachments/Attachments';
import LoopTags from './LoopTags';
import { AsyncStatus } from '../../typings/enums';

type ProcosysApiSettings = {
    baseUrl: string;
    apiVersion: string;
    scope: string[];
};

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
        ) &&
        customCheckItemsToDetermine.every((item) => item.isOk) &&
        !checkItemsToDetermine.every((item) => item.isNotApplicable)
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initializeApi = async ({
    checklistId,
    plantId,
    getAccessToken,
    settings,
}: ChecklistProps) => {
    const token = await getAccessToken(settings.scope);
    const baseURL = settings.baseUrl;
    return procosysApiService({
        apiSettings: { baseURL, token },
        apiVersion: settings.apiVersion,
        plantId,
        checklistId,
    });
};

type ChecklistProps = {
    checklistId: string;
    plantId: string;
    settings: ProcosysApiSettings;
    refreshChecklistStatus: React.Dispatch<React.SetStateAction<boolean>>;
    getAccessToken: (scope: string[]) => Promise<string>;
    setSnackbarText: (message: string) => void;
    offlineState?: boolean;
};

const Checklist = async (props: ChecklistProps): Promise<JSX.Element> => {
    const api = useMemo(
        () => initializeApi({ ...props }),
        [props.checklistId, props.plantId]
    );
    const [permissions, setPermissions] = useState<string[]>([]);
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
    const [allItemsCheckedOrNA, setAllItemsCheckedOrNA] = useState(false);
    const [reloadChecklist, setReloadChecklist] = useState(false);
    const abortController = new AbortController();

    useEffect(() => {
        setAllItemsCheckedOrNA(
            determineIfAllAreCheckedOrNA(checkItems, customCheckItems)
        );
    }, [checkItems, customCheckItems]);

    useEffect(() => {
        (async (): Promise<void> => {
            const permissionsResponse = await (await api).getPermissions();
            setPermissions(permissionsResponse);
        })();
    }, [api]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const checklistResponse = await (
                    await api
                ).getChecklist(abortController.signal);
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
            abortController.abort('Checklist component unmounted');
        };
    }, [reloadChecklist, api]);

    return (
        <AsyncPage
            fetchStatus={fetchChecklistStatus}
            errorMessage={'Unable to get checklist.'}
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
                                        api={await api}
                                        disabled={
                                            !permissions.includes('MCCR/SIGN')
                                        }
                                    />
                                )}
                                <CheckItems
                                    setCheckItems={setCheckItems}
                                    checkItems={checkItems}
                                    isSigned={isSigned}
                                    setSnackbarText={props.setSnackbarText}
                                    api={await api}
                                    disabled={
                                        !permissions.includes('MCCR/SIGN')
                                    }
                                />
                                <CustomCheckItems
                                    customCheckItems={customCheckItems}
                                    setCustomCheckItems={setCustomCheckItems}
                                    isSigned={isSigned}
                                    setSnackbarText={props.setSnackbarText}
                                    api={await api}
                                    canEdit={permissions.includes('MCCR/WRITE')}
                                    canCheck={permissions.includes('MCCR/SIGN')}
                                />
                            </ChecklistWrapper>
                        ) : null}
                        <AttachmentsHeader>Attachments</AttachmentsHeader>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={async (): Promise<
                                    Attachment[]
                                > =>
                                    (await api).getChecklistAttachments(
                                        abortController.signal
                                    )
                                }
                                getAttachment={async (
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    (await api).getChecklistAttachment(
                                        abortController.signal,
                                        attachmentId
                                    )
                                }
                                postAttachment={async (
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    (await api).postChecklistAttachment(
                                        file,
                                        title
                                    )
                                }
                                deleteAttachment={async (
                                    attachmentId: number
                                ): Promise<void> =>
                                    (await api).deleteChecklistAttachment(
                                        attachmentId
                                    )
                                }
                                setSnackbarText={props.setSnackbarText}
                                readOnly={
                                    isSigned ||
                                    !permissions.includes('MCCR/ATTACHFILE')
                                }
                                abortController={abortController}
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
                        api={await api}
                        setMultiSignOrVerifyIsOpen={setMultiSignOrVerifyIsOpen}
                        multiSignOrVerifyIsOpen={multiSignOrVerifyIsOpen}
                        refreshChecklistStatus={props.refreshChecklistStatus}
                        canAddComment={permissions.includes('MCCR/WRITE')}
                        canSign={permissions.includes('MCCR/SIGN')}
                        canVerify={permissions.includes('MCCR/VERIFY')}
                        offlineState={props.offlineState}
                    />
                )}
            </>
        </AsyncPage>
    );
};

export default Checklist;
