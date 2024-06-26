import {
    Button,
    Label,
    NativeSelect,
    TextField
} from "@equinor/eds-core-react";
import React, { useState } from "react";
import AsyncPage from "../../components/AsyncPage";
import EdsIcon from "../../components/icons/EdsIcon";
import { COLORS } from "../../style/GlobalStyles";
import {
    OrganizationDetail,
    PriorityAndSorting,
    PunchCategory,
    Type
} from "../../typings/apiTypes";
import { AsyncStatus, PunchFields, SearchStatus } from "../../typings/enums";
import {
    ChosenPerson,
    PunchFormData,
    SearchResult
} from "../../typings/helperTypes";
import useSnackbar from "../../utils/useSnackbar";
import TempAttachments from "../Attachments/TempAttachments";
import PersonsSearch from "./PersonsSearch";
import {
    AttachmentsWrapper,
    DateField,
    FormButtonWrapper,
    PunchFormWrapper
} from "./shared.style";

interface NewPunchProps {
  formFields: PunchFormData;
  createChangeHandler: (
    key: PunchFields
  ) => (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => void;
  categories: PunchCategory[];
  organizations: OrganizationDetail[];
  types: Type[];
  sortings: PriorityAndSorting[];
  priorities: PriorityAndSorting[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  submitPunchStatus: AsyncStatus;
  plantId: string;
  chosenPerson: ChosenPerson;
  setChosenPerson: React.Dispatch<React.SetStateAction<ChosenPerson>>;
  fetchNewPunchStatus: AsyncStatus;
  setTempIds: React.Dispatch<React.SetStateAction<string[]>>;
  postTempAttachment: (
    plantId: string,
    formData: FormData,
    title: string
  ) => Promise<string>;
  hits: SearchResult;
  searchStatus: SearchStatus;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  disablePersonsSearch?: boolean;
  disableAttahments?: boolean;
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
  chosenPerson,
  setChosenPerson,
  fetchNewPunchStatus,
  setTempIds,
  postTempAttachment,
  hits,
  searchStatus,
  query,
  setQuery,
  disablePersonsSearch,
  disableAttahments
}: NewPunchProps): JSX.Element => {
  const { snackbar, setSnackbarText } = useSnackbar();
  const [showPersonsSearch, setShowPersonsSearch] = useState(false);

  const handlePersonChosen = (
    id: string,
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
          "Unable to load new punch. Please check your connection, permissions, or refresh this page."
        }
        loadingMessage={"Loading new punch."}
      >
        <main>
          {showPersonsSearch ? (
            <PersonsSearch
              setChosenPerson={handlePersonChosen}
              setShowPersonSearch={setShowPersonsSearch}
              hits={hits}
              searchStatus={searchStatus}
              query={query}
              setQuery={setQuery}
            />
          ) : null}
          <PunchFormWrapper onSubmit={handleSubmit}>
            <NativeSelect
              required
              id="PunchCategorySelect"
              label="Punch category *"
              disabled={submitPunchStatus === AsyncStatus.LOADING}
              onChange={createChangeHandler(PunchFields.CATEGORY)}
              defaultValue={""}
            >
              <option hidden disabled value={""} />
              {categories.map((category) => (
                <option
                  key={category.code}
                  value={category.code}
                >{`${category.description}`}</option>
              ))}
            </NativeSelect>
            <TextField
              required
              maxLength={255}
              value={formFields.description}
              onChange={createChangeHandler(PunchFields.DESCRIPTION)}
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
              onChange={createChangeHandler(PunchFields.RAISED_BY)}
              defaultValue={""}
            >
              <option hidden disabled value={""} />
              {organizations.map((organization) => {
                return (
                  <option key={organization.guid} value={organization.guid}>
                    {organization.description}
                  </option>
                );
              })}
            </NativeSelect>
            <NativeSelect
              required
              id="ClearingBySelect"
              label="Clearing by *"
              disabled={submitPunchStatus === AsyncStatus.LOADING}
              onChange={createChangeHandler(PunchFields.CLEARING_BY)}
              defaultValue={""}
            >
              <option hidden disabled value={""} />
              {organizations.map((organization) => (
                <option key={organization.guid} value={organization.guid}>
                  {organization.description}
                </option>
              ))}
            </NativeSelect>
            <h5>Optional fields</h5>
            <TextField
              id="actionByPerson"
              value={chosenPerson.name}
              onChange={() => ({})}
              inputIcon={
                chosenPerson.id ? (
                  <div
                    onClick={(): void =>
                      setChosenPerson({
                        id: null,
                        name: ""
                      })
                    }
                  >
                    <EdsIcon name={"close"} color={COLORS.black} />
                  </div>
                ) : null
              }
              onClick={(): void => setShowPersonsSearch(true)}
              label={"Action by person"}
              disabled={disablePersonsSearch}
            />
            <DateField>
              <Label label="Due Date" htmlFor="dueDate2" />
              <input
                type="date"
                id="dueDate"
                role="datepicker"
                onChange={createChangeHandler(PunchFields.DUE_DATE)}
              />
            </DateField>
            <NativeSelect
              id="PunchTypeSelect"
              label="Type"
              disabled={
                submitPunchStatus === AsyncStatus.LOADING || types.length < 1
              }
              onChange={createChangeHandler(PunchFields.TYPE)}
              defaultValue={""}
            >
              <option hidden disabled value={""} />
              {types.map((type) => (
                <option
                  key={type.guid}
                  value={type.guid}
                >{`${type.code}. ${type.description}`}</option>
              ))}
            </NativeSelect>
            <NativeSelect
              id="PunchSortingSelect"
              label="Sorting"
              disabled={
                submitPunchStatus === AsyncStatus.LOADING || sortings.length < 1
              }
              onChange={createChangeHandler(PunchFields.SORTING)}
              defaultValue={""}
            >
              <option hidden disabled value={""} />
              {sortings.map((sort) => (
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
                submitPunchStatus === AsyncStatus.LOADING ||
                priorities.length < 1
              }
              onChange={createChangeHandler(PunchFields.PRIORITY)}
              defaultValue={""}
            >
              <option hidden disabled value={""} />
              {priorities.map((priority) => (
                <option
                  key={priority.guid}
                  value={priority.guid}
                >{`${priority.code}. ${priority.description}`}</option>
              ))}
            </NativeSelect>
            <TextField
              type="number"
              label="Estimate"
              id="estimate"
              value={formFields.estimate}
              onChange={createChangeHandler(PunchFields.ESTIMATE)}
              disabled={submitPunchStatus === AsyncStatus.LOADING}
            />
            {disableAttahments ? (
              <></>
            ) : (
              <>
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
              </>
            )}
            <FormButtonWrapper>
              <Button
                type="submit"
                disabled={submitPunchStatus === AsyncStatus.LOADING}
              >
                Create punch
              </Button>
            </FormButtonWrapper>
          </PunchFormWrapper>
        </main>
      </AsyncPage>
      {snackbar}
    </>
  );
};

export default NewPunch;
