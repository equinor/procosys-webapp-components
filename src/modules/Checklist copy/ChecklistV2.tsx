import React, { useEffect, useState } from 'react';
import {
    Attachment,
    CheckItem,
    ChecklistDetails,
    CustomCheckItem,
    LoopTag,
} from '../../typings/apiTypes';
import CheckItemsV2 from './CheckItems/CheckItemsV2';
import ChecklistSignature from './ChecklistSignatureV2';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import CustomCheckItems from './CheckItems/CustomCheckItemsV2';
import CheckAllButtonV2 from './CheckItems/CheckAllButtonV2';
import AsyncPage from '../../components/AsyncPage';
import Attachments from '../Attachments/Attachments';
import { AsyncStatus } from '../../typings/enums';
import ChecklistV2Api from './checklistV2Api';
import LoopTags from '../Checklist/LoopTags';

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

type ChecklistProps = {
    refreshChecklistStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: (message: string) => void;
    permissions: string[];
    api: ChecklistV2Api;
    plantId: string;
    checklistId: string;
    offlineState?: boolean;
};

const ChecklistV2 = ({
    refreshChecklistStatus,
    setSnackbarText,
    permissions,
    api,
    plantId,
    checklistId,
    offlineState,
}: ChecklistProps): JSX.Element => {
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
            try {
                const checklistResponse = await api.getChecklist(
                    plantId,
                    checklistId,
                    abortController.signal
                );
                setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                setCheckItems(checklistResponse.checkItems);
                setCustomCheckItems(checklistResponse.customCheckItems);
                setChecklistDetails(checklistResponse.checkList);
                setLoopTags(checklistResponse.loopTags);
                setFetchChecklistStatus(AsyncStatus.SUCCESS);
            } catch (err) {
                setFetchChecklistStatus(AsyncStatus.ERROR);
                if (!(err instanceof Error)) return;
                setSnackbarText(err.message);
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
                                    <CheckAllButtonV2
                                        setSnackbarText={setSnackbarText}
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
                                        disabled={
                                            !permissions?.includes('MCCR/SIGN')
                                        }
                                        plantId={plantId}
                                        checklistId={checklistId}
                                    />
                                )}
                                <CheckItemsV2
                                    setCheckItems={setCheckItems}
                                    checkItems={checkItems}
                                    isSigned={isSigned}
                                    setSnackbarText={setSnackbarText}
                                    api={api}
                                    disabled={
                                        !permissions?.includes('MCCR/SIGN')
                                    }
                                    plantId={plantId}
                                    checklistId={checklistId}
                                />
                                <CustomCheckItems
                                    customCheckItems={customCheckItems}
                                    setCustomCheckItems={setCustomCheckItems}
                                    isSigned={isSigned}
                                    setSnackbarText={setSnackbarText}
                                    api={api}
                                    canEdit={permissions?.includes(
                                        'MCCR/WRITE'
                                    )}
                                    canCheck={permissions?.includes(
                                        'MCCR/SIGN'
                                    )}
                                    plantId={plantId}
                                    checklistId={checklistId}
                                />
                            </ChecklistWrapper>
                        ) : null}
                        <AttachmentsHeader>Attachments</AttachmentsHeader>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={(): Promise<Attachment[]> =>
                                    api.getChecklistAttachments(
                                        plantId,
                                        checklistId,
                                        abortController.signal
                                    )
                                }
                                getAttachment={(
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    api.getChecklistAttachment(
                                        plantId,
                                        checklistId,
                                        attachmentId,
                                        abortController.signal
                                    )
                                }
                                postAttachment={(
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    api.postChecklistAttachment(
                                        plantId,
                                        checklistId,
                                        file,
                                        title
                                    )
                                }
                                deleteAttachment={(
                                    attachmentId: number
                                ): Promise<void> =>
                                    api.deleteChecklistAttachment(
                                        plantId,
                                        checklistId,
                                        attachmentId
                                    )
                                }
                                setSnackbarText={setSnackbarText}
                                readOnly={
                                    isSigned ||
                                    !permissions?.includes('MCCR/ATTACHFILE')
                                }
                                abortController={abortController}
                            />
                        </AttachmentsWrapper>
                    </>
                )}

                {checklistDetails && (
                    <ChecklistSignature
                        setSnackbarText={setSnackbarText}
                        reloadChecklist={setReloadChecklist}
                        allItemsCheckedOrNA={allItemsCheckedOrNA}
                        isSigned={isSigned}
                        details={checklistDetails}
                        setIsSigned={setIsSigned}
                        setMultiSignOrVerifyIsOpen={setMultiSignOrVerifyIsOpen}
                        multiSignOrVerifyIsOpen={multiSignOrVerifyIsOpen}
                        refreshChecklistStatus={refreshChecklistStatus}
                        canAddComment={permissions?.includes('MCCR/WRITE')}
                        canSign={permissions?.includes('MCCR/SIGN')}
                        canVerify={permissions?.includes('MCCR/VERIFY')}
                        api={api}
                        plantId={plantId}
                        checklistId={checklistId}
                        offlineState={offlineState}
                    />
                )}
            </>
        </AsyncPage>
    );
};

export default ChecklistV2;
