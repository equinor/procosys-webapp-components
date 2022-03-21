import React, { useState } from 'react';
import useSnackbar from '../../utils/useSnackbar';
import AsyncPage from '../../components/AsyncPage';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import { AsyncStatus } from '../../typings/enums';
import TempAttachments from '../Attachments/TempAttachments';
import {
    Person,
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../typings/apiTypes';
import {
    NativeSelect,
    TextField,
    Label,
    Button,
} from '@equinor/eds-core-react';
import { CancelToken } from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import PersonsSearch from './PersonsSearch/PersonsSearch';
import { ChosenPerson, PunchFormData } from '../../typings/helperTypes';

const NewPunchFormWrapper = styled.form`
    background-color: ${COLORS.white};
    padding: 0 4% 66px 4%;
    overflow: hidden;
    & > div {
        margin-top: 16px;
    }
`;

const FormButtonWrapper = styled.div`
    display: flex;
    margin: 16px 0;
    justify-content: flex-end;
`;

const DateField = styled.div`
    & > input {
        box-sizing: border-box;
        width: 100%;
        min-width: 95%;
        background-color: ${COLORS.greyBackground};
        height: 40px;
        border: none;
        box-shadow: inset 0 -1px 0 0 var(--eds_text__static_ic, #6f6f6f);
        font-family: Equinor;
        padding: 0 8px;
    }
    & > input:focus-visible {
        outline: 2px solid ${COLORS.mossGreen};
        box-shadow: none;
    }
    & > input:disabled {
        box-shadow: none;
        color: ${COLORS.disabledText};
    }
`;

const AttachmentsWrapper = styled.div`
    margin: 0 -4% 16px -4%;
    padding: 16px 4%;
    background-color: ${COLORS.fadedBlue};
    height: 100px;
`;

interface NewPunchProps {
    formFields: PunchFormData;
    createChangeHandler: (
        key:
            | 'category'
            | 'description'
            | 'raisedBy'
            | 'clearingBy'
            | 'actionByPerson'
            | 'dueDate'
            | 'type'
            | 'sorting'
            | 'priority'
            | 'estimate'
    ) => (
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
        >
    ) => void;
    categories: PunchCategory[];
    organizations: PunchOrganization[];
    types: PunchType[];
    sortings: PunchSort[];
    priorities: PunchPriority[];
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    submitPunchStatus: AsyncStatus;
    plantId: string;
    getPersonsByName: (
        plantId: string,
        query: string,
        cancelToken: CancelToken
    ) => Promise<Person[]>;
    chosenPerson: ChosenPerson;
    setChosenPerson: React.Dispatch<React.SetStateAction<ChosenPerson>>;
    fetchNewPunchStatus: AsyncStatus;
    setTempIds: React.Dispatch<React.SetStateAction<string[]>>;
    postTempAttachment: (
        plantId: string,
        formData: FormData,
        title: string
    ) => Promise<string>;
}

const NewPunch = ({
    formFields,
    createChangeHandler,
    categories,
    organizations,
    types,
    sortings,
    priorities,
    handleSubmit,
    submitPunchStatus,
    plantId,
    getPersonsByName,
    chosenPerson,
    setChosenPerson,
    fetchNewPunchStatus,
    setTempIds,
    postTempAttachment,
}: NewPunchProps): JSX.Element => {
    const { snackbar, setSnackbarText } = useSnackbar();
    const [showPersonsSearch, setShowPersonsSearch] = useState(false);

    const handlePersonChosen = (
        id: number,
        firstName: string,
        lastName: string
    ): void => {
        setChosenPerson({ id, name: `${firstName} ${lastName}` });
        setShowPersonsSearch(false);
    };

    return (
        <>
            <AsyncPage
                fetchStatus={fetchNewPunchStatus}
                errorMessage={
                    'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
                }
                loadingMessage={'Loading new punch.'}
            >
                <main>
                    {showPersonsSearch ? (
                        <PersonsSearch
                            setChosenPerson={handlePersonChosen}
                            setShowPersonSearch={setShowPersonsSearch}
                            plantId={plantId}
                            getPersonsByName={getPersonsByName}
                        />
                    ) : null}
                    <NewPunchFormWrapper onSubmit={handleSubmit}>
                        <NativeSelect
                            required
                            id="PunchCategorySelect"
                            label="Punch category *"
                            disabled={submitPunchStatus === AsyncStatus.LOADING}
                            onChange={createChangeHandler('category')}
                            defaultValue={''}
                        >
                            <option hidden disabled value={''} />
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
                            value={formFields.description}
                            onChange={createChangeHandler('description')}
                            label="Description *"
                            multiline
                            rows={5}
                            id="NewPunchDescription"
                            disabled={submitPunchStatus === AsyncStatus.LOADING}
                        />
                        <NativeSelect
                            required
                            label="Raised by *"
                            id="RaisedBySelect"
                            disabled={submitPunchStatus === AsyncStatus.LOADING}
                            onChange={createChangeHandler('raisedBy')}
                            defaultValue={''}
                        >
                            <option hidden disabled value={''} />
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
                            label="Clearing by *"
                            disabled={submitPunchStatus === AsyncStatus.LOADING}
                            onChange={createChangeHandler('clearingBy')}
                            defaultValue={''}
                        >
                            <option hidden disabled value={''} />
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
                            value={chosenPerson.name}
                            inputIcon={
                                chosenPerson.id ? (
                                    <div
                                        onClick={(): void =>
                                            setChosenPerson({
                                                id: null,
                                                name: '',
                                            })
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
                                id="dueDate"
                                role="datepicker"
                                onChange={createChangeHandler('dueDate')}
                            />
                        </DateField>
                        <NativeSelect
                            id="PunchTypeSelect"
                            label="Type"
                            disabled={
                                submitPunchStatus === AsyncStatus.LOADING ||
                                types.length < 1
                            }
                            onChange={createChangeHandler('type')}
                            defaultValue={''}
                        >
                            <option hidden disabled value={''} />
                            {types.map((type) => (
                                <option
                                    key={type.id}
                                    value={type.id}
                                >{`${type.code}. ${type.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchSortingSelect"
                            label="Sorting"
                            disabled={
                                submitPunchStatus === AsyncStatus.LOADING ||
                                sortings.length < 1
                            }
                            onChange={createChangeHandler('sorting')}
                            defaultValue={''}
                        >
                            <option hidden disabled value={''} />
                            {sortings.map((sort) => (
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
                                submitPunchStatus === AsyncStatus.LOADING ||
                                priorities.length < 1
                            }
                            onChange={createChangeHandler('priority')}
                            defaultValue={''}
                        >
                            <option hidden disabled value={''} />
                            {priorities.map((priority) => (
                                <option
                                    key={priority.id}
                                    value={priority.id}
                                >{`${priority.code}. ${priority.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            type="number"
                            label="Estimate"
                            id="estimate"
                            value={formFields.estimate}
                            onChange={createChangeHandler('estimate')}
                            disabled={submitPunchStatus === AsyncStatus.LOADING}
                        />
                        <h5>Attachments</h5>
                        <AttachmentsWrapper>
                            <TempAttachments
                                setSnackbarText={setSnackbarText}
                                setTempAttachmentIds={setTempIds}
                                postTempAttachment={(
                                    formData: FormData,
                                    title: string
                                ): Promise<string> =>
                                    postTempAttachment(plantId, formData, title)
                                }
                            />
                        </AttachmentsWrapper>
                        <FormButtonWrapper>
                            <Button
                                type="submit"
                                disabled={
                                    submitPunchStatus === AsyncStatus.LOADING
                                }
                            >
                                Create punch
                            </Button>
                        </FormButtonWrapper>
                    </NewPunchFormWrapper>
                </main>
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default NewPunch;
