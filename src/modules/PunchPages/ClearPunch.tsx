import React from 'react';
import {
    Button,
    Icon,
    Label,
    NativeSelect,
    TextField,
} from '@equinor/eds-core-react';
import useClearPunchFacade from './useClearPunchFacade';
import ReloadButton from '../../components/buttons/ReloadButton';
import ErrorPage from '../../components/error/ErrorPage';
import EdsIcon from '../../components/icons/EdsIcon';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import { COLORS } from '../../style/GlobalStyles';
import { AsyncStatus, SearchStatus } from '../../typings/enums';
import ensure from '../../utils/ensure';
import Attachments from '../Attachments/Attachments';
import CommentCard from '../../components/Comments/CommentCard';
import PersonsSearch from './PersonsSearch';
import {
    PunchFormWrapper,
    DateField,
    AttachmentsWrapper,
    FormButtonWrapper,
} from './shared.style';
import {
    APIComment,
    Attachment,
    PunchComment,
    PunchCategory,
    PunchItem,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../typings/apiTypes';
import {
    PunchEndpoints,
    SearchResult,
    UpdatePunchData,
} from '../../typings/helperTypes';

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
    organizations: PunchOrganization[];
    categories: PunchCategory[];
    types: PunchType[];
    sortings: PunchSort[];
    priorities: PunchPriority[];
    clearPunchStatus: AsyncStatus;
    setClearPunchStatus: React.Dispatch<React.SetStateAction<AsyncStatus>>;
    clearPunch: () => Promise<void>;
    redirectAfterClearing: () => void;
    fetchOptionsStatus: AsyncStatus;
    updatePunchStatus: AsyncStatus;
    getPunchAttachments: (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ) => Promise<Attachment[]>;
    getPunchAttachment: (
        plantId: string,
        punchItemId: number,
        attachmentId: number,
        abortSignal?: AbortSignal
    ) => Promise<Blob>;
    postPunchAttachment: (
        plantId: string,
        punchItemId: number,
        file: FormData,
        title: string
    ) => Promise<void>;
    deletePunchAttachment: (
        plantId: string,
        punchItemId: number,
        attachmentId: number
    ) => Promise<void>;
    getPunchComments?: (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ) => Promise<APIComment[]>;
    postPunchComment?: (
        plantId: string,
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
                                            category.code === punchItem.status
                                    )
                                ).id
                            }
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >{`${category.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            required
                            maxLength={255}
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
                                        {
                                            Description: punchItem.description,
                                        }
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
                                punchItem.raisedByCode
                            )}
                            onChange={handleRaisedByChange}
                        >
                            <option hidden disabled value={-1} />

                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
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
                                punchItem.clearingByCode
                            )}
                            onChange={handleClearingByChange}
                        >
                            <option hidden disabled value={-1}></option>

                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <h5>Optional fields</h5>
                        <TextField
                            id="actionByPerson"
                            defaultValue={
                                punchItem.actionByPerson
                                    ? `${punchItem.actionByPersonFirstName} ${punchItem.actionByPersonLastName}`
                                    : ''
                            }
                            disabled={canEdit === false || disablePersonsSearch}
                            inputIcon={
                                punchItem.actionByPerson && canEdit ? (
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
                                    punchItem.dueDate
                                        ? punchItem.dueDate.split('T')[0]
                                        : ''
                                }
                                onChange={handleDueDateChange}
                                onBlur={(): void => {
                                    updateDatabase(
                                        punchEndpoints.updateDueDate,
                                        {
                                            DueDate: punchItem.dueDate,
                                        }
                                    );
                                }}
                            />
                        </DateField>
                        <NativeSelect
                            id="PunchTypeSelect"
                            label="Type"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                types.length < 1 ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.typeCode
                                    ? types.find(
                                          (type) =>
                                              type.code === punchItem.typeCode
                                      )?.id
                                    : ''
                            }
                            onChange={handleTypeChange}
                        >
                            <option hidden disabled value={''} />
                            {types?.map((type) => (
                                <option
                                    key={type.id}
                                    value={type.id}
                                >{`${type.code}. ${type.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchSortSelect"
                            label="Sorting"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                sortings.length < 1 ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.sorting
                                    ? sortings.find(
                                          (sort) =>
                                              sort.code === punchItem.sorting
                                      )?.id
                                    : ''
                            }
                            onChange={handleSortingChange}
                        >
                            <option hidden disabled value={''} />
                            {sortings?.map((sort) => (
                                <option
                                    key={sort.id}
                                    value={sort.id}
                                >{`${sort.code}. ${sort.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchPrioritySelect"
                            label="Priority"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                priorities.length < 1 ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.priorityCode
                                    ? priorities.find(
                                          (priority) =>
                                              priority.code ===
                                              punchItem.priorityCode
                                      )?.id
                                    : ''
                            }
                            onChange={handlePriorityChange}
                        >
                            <option hidden disabled value={''} />
                            {priorities?.map((priority) => (
                                <option
                                    key={priority.id}
                                    value={priority.id}
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
                                        {
                                            Estimate: punchItem.estimate,
                                        }
                                    );
                                }
                            }}
                            onChange={handleEstimateChange}
                        />
                        <h5>Attachments</h5>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={(): Promise<Attachment[]> =>
                                    getPunchAttachments(
                                        plantId,
                                        punchItem.id,
                                        abortController?.signal
                                    )
                                }
                                getAttachment={(
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    getPunchAttachment(
                                        plantId,
                                        punchItem.id,
                                        attachmentId,
                                        abortController?.signal
                                    )
                                }
                                postAttachment={(
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    postPunchAttachment(
                                        plantId,
                                        punchItem.id,
                                        file,
                                        title
                                    )
                                }
                                deleteAttachment={(
                                    attachmentId: number
                                ): Promise<void> =>
                                    deletePunchAttachment(
                                        plantId,
                                        punchItem.id,
                                        attachmentId
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
