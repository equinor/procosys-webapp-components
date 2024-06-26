import {
    Button,
    Label,
    NativeSelect,
    TextField
} from '@equinor/eds-core-react';
import React from 'react';
import CommentCard from '../../components/Comments/CommentCard';
import ReloadButton from '../../components/buttons/ReloadButton';
import ErrorPage from '../../components/error/ErrorPage';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { COLORS } from '../../style/GlobalStyles';
import {
    APIComment,
    Attachment,
    LibrayTypes,
    PunchCategory,
    PunchComment,
    PunchItem,
} from '../../typings/apiTypes';
import { AsyncStatus, SearchStatus } from '../../typings/enums';
import {
    PunchEndpoints,
    SearchResult,
    UpdatePunchData,
} from '../../typings/helperTypes';
import ensure from '../../utils/ensure';
import Attachments from '../Attachments/Attachments';
import PersonsSearch from './PersonsSearch';
import {
    AttachmentsWrapper,
    DateField,
    FormButtonWrapper,
    PunchFormWrapper,
} from './shared.style';
import useClearPunchFacade from './useClearPunchFacade';

type ClearPunchProps = {
    plantId: string;
    punchItem: PunchItem;
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>;
    canEdit: boolean;
    canClear: boolean;
    punchEndpoints: PunchEndpoints;
    updateDatabase: (
        endpoint: string,
        updateData: UpdatePunchData
    ) => Promise<void>;
    organizations: LibrayTypes[];
    categories: PunchCategory[];
    types: LibrayTypes[];
    sortings: LibrayTypes[];
    priorities: LibrayTypes[];
    clearPunchStatus: AsyncStatus;
    setClearPunchStatus: React.Dispatch<React.SetStateAction<AsyncStatus>>;
    clearPunch: () => Promise<void>;
    redirectAfterClearing: () => void;
    fetchOptionsStatus: AsyncStatus;
    updatePunchStatus: AsyncStatus;
    getPunchAttachments: (
        plantId: string,
        guid: string
    ) => Promise<Attachment[]>;
    getPunchAttachment: (
        plantId: string,
        punchGuid: string,
        attachmentGuid: string,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    postPunchAttachment: (
        plantId: string,
        punchItemId: string,
        file: FormData,
        title: string
    ) => Promise<void>;
    deletePunchAttachment: (
        plantId: string,
        punchItemId: string,
        attachmentGuid: string,
        rowVersion: string
    ) => Promise<void>;
    getPunchComments?: (plantId: string, guid: string) => Promise<APIComment[]>;
    postPunchComment?: (
        plantId: string,
        guid: string,
        comment: PunchComment
    ) => Promise<void>;
    snackbar: JSX.Element;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    hits: SearchResult;
    searchStatus: SearchStatus;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    abortController?: AbortController;
    disablePersonsSearch?: boolean;
};

const ClearPunch = ({
    plantId,
    punchItem,
    setPunchItem,
    canEdit,
    canClear,
    punchEndpoints,
    updateDatabase,
    organizations,
    categories,
    types,
    sortings,
    priorities,
    clearPunchStatus,
    setClearPunchStatus,
    clearPunch,
    redirectAfterClearing,
    fetchOptionsStatus,
    updatePunchStatus,
    getPunchAttachments,
    getPunchAttachment,
    postPunchAttachment,
    deletePunchAttachment,
    getPunchComments,
    postPunchComment,
    snackbar,
    setSnackbarText,
    hits,
    searchStatus,
    query,
    setQuery,
    abortController,
    disablePersonsSearch,
}: ClearPunchProps): JSX.Element => {
    const {
        clearPunchItem,
        handleCategoryChange,
        handleDescriptionChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleActionByPersonChange,
        handleDueDateChange,
        handleSortingChange,
        handlePriorityChange,
        handleEstimateChange,
        showPersonsSearch,
        setShowPersonsSearch,
        getDefaultOrganization,
    } = useClearPunchFacade(
        setPunchItem,
        punchEndpoints,
        updateDatabase,
        organizations,
        categories,
        types,
        sortings,
        priorities,
        setClearPunchStatus,
        redirectAfterClearing,
        clearPunch
    );

    let descriptionBeforeEntering = '';
    let estimateBeforeEntering: number | null = 0;

    if (fetchOptionsStatus === AsyncStatus.SUCCESS) {
        return (
            <>
                <main>
                    {showPersonsSearch ? (
                        <PersonsSearch
                            setChosenPerson={handleActionByPersonChange}
                            setShowPersonSearch={setShowPersonsSearch}
                            hits={hits}
                            searchStatus={searchStatus}
                            query={query}
                            setQuery={setQuery}
                        />
                    ) : null}
                    <PunchFormWrapper onSubmit={clearPunchItem}>
                        <NativeSelect
                            required
                            id="PunchCategorySelect"
                            label="Punch category"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
                            defaultValue={
                                ensure(
                                    categories.find(
                                        (category) =>
                                            category.code === punchItem.category
                                    )
                                ).code
                            }
                            onChange={handleCategoryChange}
                        >
                            {categories?.map((category) => (
                                <option
                                    key={category.code}
                                    value={category.code}
                                >{`${category.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            required
                            maxLength={2000}
                            value={punchItem.description}
                            label="Description"
                            multiline
                            rows={5}
                            id="NewPunchDescription"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
                            onFocus={(): string =>
                                (descriptionBeforeEntering =
                                    punchItem.description)
                            }
                            onBlur={(): void => {
                                if (
                                    punchItem.description !==
                                    descriptionBeforeEntering
                                ) {
                                    updateDatabase(
                                        punchEndpoints.updateDescription,
                                        punchItem.description
                                    );
                                }
                            }}
                            onChange={handleDescriptionChange}
                        />
                        <NativeSelect
                            required
                            label="Raised by"
                            id="RaisedBySelect"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
                            defaultValue={getDefaultOrganization(
                                punchItem.raisedByOrg.guid
                            )}
                            onChange={handleRaisedByChange}
                        >
                            <option hidden disabled value={-1} />

                            {organizations.map((organization) => (
                                <option
                                    key={organization.guid}
                                    value={organization.guid}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            required
                            id="ClearingBySelect"
                            label="Clearing by"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
                            defaultValue={getDefaultOrganization(
                                punchItem.clearingByOrg.guid
                            )}
                            onChange={handleClearingByChange}
                        >
                            <option hidden disabled value={-1}></option>

                            {organizations.map((organization) => (
                                <option
                                    key={organization.guid}
                                    value={organization.guid}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <h5>Optional fields</h5>
                        <TextField
                            id="actionByPerson"
                            value={
                                punchItem.actionBy
                                    ? `${punchItem.actionBy.firstName} ${punchItem.actionBy.lastName}`
                                    : ''
                            }
                            onChange={() => ({})}
                            disabled={canEdit === false || disablePersonsSearch}
                            inputIcon={
                                punchItem.actionBy && canEdit ? (
                                    <div
                                        onClick={(): void =>
                                            handleActionByPersonChange(
                                                null,
                                                '',
                                                ''
                                            )
                                        }
                                    >
                                        <EdsIcon
                                            name={'close'}
                                            color={COLORS.black}
                                        />
                                    </div>
                                ) : null
                            }
                            onClick={(): void => setShowPersonsSearch(true)}
                            label={'Action by person'}
                        />
                        <DateField>
                            <Label label="Due Date" htmlFor="dueDate2" />
                            <input
                                type="date"
                                id="DueDatePicker"
                                role="datepicker"
                                disabled={
                                    clearPunchStatus === AsyncStatus.LOADING ||
                                    canEdit === false
                                }
                                value={
                                    punchItem.dueTimeUtc
                                        ? punchItem.dueTimeUtc.split('T')[0]
                                        : ''
                                }
                                onChange={handleDueDateChange}
                                onBlur={(): void => {
                                    updateDatabase(
                                        punchEndpoints.updateDueDate,
                                        punchItem.dueTimeUtc
                                    );
                                }}
                            />
                        </DateField>
                        <NativeSelect
                            id="PunchTypeSelect"
                            label="Type"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                !types?.length ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.type
                                    ? types.find(
                                          (type) =>
                                              type.guid === punchItem.type?.guid
                                      )?.guid
                                    : ''
                            }
                            onChange={handleTypeChange}
                        >
                            <option hidden disabled value={''} />
                            {types?.map((type) => (
                                <option
                                    key={type.guid}
                                    value={type.guid}
                                >{`${type.code}. ${type.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchSortSelect"
                            label="Sorting"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                !sortings?.length ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.sorting
                                    ? sortings.find(
                                          (sort) =>
                                              sort.guid ===
                                              punchItem.sorting?.guid
                                      )?.guid
                                    : ''
                            }
                            onChange={handleSortingChange}
                        >
                            <option hidden disabled value={''} />
                            {sortings?.map((sort) => (
                                <option
                                    key={sort.guid}
                                    value={sort.guid}
                                >{`${sort.code}. ${sort.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchPrioritySelect"
                            label="Priority"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                !priorities?.length ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.priority
                                    ? priorities.find(
                                          (priority) =>
                                              priority.guid ===
                                              punchItem.priority?.guid
                                      )?.guid
                                    : ''
                            }
                            onChange={handlePriorityChange}
                        >
                            <option hidden disabled value={''} />
                            {priorities?.map((priority) => (
                                <option
                                    key={priority.guid}
                                    value={priority.guid}
                                >{`${priority.code}. ${priority.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            type="number"
                            defaultValue={
                                punchItem.estimate ? punchItem.estimate : ''
                            }
                            label="Estimate"
                            id="Estimate"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
                            onFocus={(): number | null =>
                                (estimateBeforeEntering = punchItem.estimate)
                            }
                            onBlur={(): void => {
                                if (
                                    punchItem.estimate !==
                                    estimateBeforeEntering
                                ) {
                                    updateDatabase(
                                        punchEndpoints.updateEstimate,
                                        punchItem.estimate
                                    );
                                }
                            }}
                            onChange={handleEstimateChange}
                        />
                        <h5>Attachments</h5>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={(): Promise<Attachment[]> =>
                                    getPunchAttachments(plantId, punchItem.guid)
                                }
                                getAttachment={(
                                    attachmentGuid: string
                                ): Promise<Blob> =>
                                    getPunchAttachment(
                                        plantId,
                                        punchItem.guid,
                                        attachmentGuid,
                                        abortController?.signal
                                    )
                                }
                                postAttachment={(
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    postPunchAttachment(
                                        plantId,
                                        punchItem.guid,
                                        file,
                                        title
                                    )
                                }
                                deleteAttachment={(
                                    attachmentGuid: any,
                                    attachmentRowVersion: any
                                ): Promise<void> =>
                                    deletePunchAttachment(
                                        plantId,
                                        punchItem.guid,
                                        attachmentGuid,
                                        attachmentRowVersion
                                    )
                                }
                                setSnackbarText={setSnackbarText}
                                readOnly={canEdit === false}
                                abortController={abortController}
                            />
                        </AttachmentsWrapper>
                        {getPunchComments && postPunchComment ? (
                            <CommentCard
                                plantId={plantId}
                                punchItem={punchItem}
                                getPunchComments={getPunchComments}
                                postPunchComment={postPunchComment}
                                showCommentTextField={true}
                                setSnackbarText={setSnackbarText}
                            ></CommentCard>
                        ) : (
                            <></>
                        )}
                        <FormButtonWrapper>
                            <Button
                                type="submit"
                                disabled={
                                    updatePunchStatus === AsyncStatus.LOADING ||
                                    clearPunchStatus === AsyncStatus.LOADING ||
                                    canClear === false ||
                                    punchItem.statusControlledBySwcr
                                }
                            >
                                Clear
                            </Button>
                        </FormButtonWrapper>
                    </PunchFormWrapper>
                </main>
                {snackbar}
            </>
        );
    } else if (fetchOptionsStatus === AsyncStatus.ERROR) {
        return (
            <>
                <main>
                    <ErrorPage
                        title="Unable to load punch item."
                        description="Please check your connection, reload this page or try again later."
                        actions={[<ReloadButton key={'reload'} />]}
                    />
                </main>
                {snackbar}
            </>
        );
    } else {
        return (
            <>
                <SkeletonLoadingPage text="Loading punch item" />
                {snackbar}
            </>
        );
    }
};

export default ClearPunch;
