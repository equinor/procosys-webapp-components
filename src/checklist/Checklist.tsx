import React, { useEffect, useState, useMemo } from 'react';
import {
    AsyncStatus,
    Attachment,
    CheckItem,
    ChecklistDetails,
    CustomCheckItem,
    LoopTag,
} from '../services/apiTypes';
import CheckItems from './CheckItems/CheckItems';
import ChecklistSignature from './ChecklistSignature';
import styled from 'styled-components';
import axios, { CancelToken } from 'axios';
import { Banner } from '@equinor/eds-core-react';
import procosysApiService from '../services/procosysApi';
import baseApi, { ProcosysApiSettings } from '../services/baseApi';
import CustomCheckItems from './CheckItems/CustomCheckItems';
import CheckAllButton from './CheckItems/CheckAllButton';
import AsyncPage from '../components/AsyncPage';
import Attachments from '../attachments/Attachments';
import { List } from '@equinor/eds-core-react';
import { Caption, COLORS } from '../style/GlobalStyles';
import EdsIcon from '../components/icons/EdsIcon';

const ChecklistWrapper = styled.div`
    padding: 0 4%;
    display: flex;
    flex-direction: column;
`;

const LoopTagWrapper = styled.div`
    padding: 0 4%;
    background-color: #deecee;
    padding-bottom: 16px;
    & p {
        margin: 0;
        margin-bottom: 4px;
    }
    & button {
        & p {
            color: ${COLORS.mossGreen};
            display: flex;
            align-items: center;
        }
    }
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
    const [showMore, setShowMore] = useState(false);
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
        props.refreshChecklistStatus((prev: boolean) => !prev);
    }, [isSigned]);

    useEffect(() => {
        const element = document.getElementById('multiSignVerifyHeader');
        if (element) element.scrollIntoView(true);
    }, [multiSignOrVerifyIsOpen]);

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

    const handleShowMoreClick = (): void => {
        setShowMore(true);
    };

    const handleShowLessClick = (): void => {
        setShowMore(false);
    };

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
                            <LoopTagWrapper>
                                <Caption>Loop tags:</Caption>
                                <List>
                                    {loopTags
                                        .slice(
                                            0,
                                            showMore ? loopTags.length : 3
                                        )
                                        .map((loopTag) => (
                                            <List.Item key={loopTag.tagId}>
                                                <Caption>
                                                    {loopTag.tagNo}
                                                </Caption>
                                            </List.Item>
                                        ))}
                                </List>
                                <button
                                    onClick={
                                        showMore
                                            ? handleShowLessClick
                                            : handleShowMoreClick
                                    }
                                >
                                    <Caption>
                                        {showMore
                                            ? 'Show less'
                                            : `Show all (${loopTags.length})`}
                                        <EdsIcon
                                            name={
                                                showMore
                                                    ? 'chevron_down'
                                                    : 'chevron_right'
                                            }
                                            size={16}
                                        />
                                    </Caption>
                                </button>
                            </LoopTagWrapper>
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
                                getAttachments={(
                                    cancelToken: CancelToken
                                ): Promise<Attachment[]> =>
                                    api.getChecklistAttachments(cancelToken)
                                }
                                getAttachment={(
                                    cancelToken: CancelToken,
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    api.getChecklistAttachment(
                                        cancelToken,
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
                    />
                )}
            </>
        </AsyncPage>
    );
};

export default Checklist;
