import { useEffect, useState } from "react";
import { ChecklistPreview } from "../typings/apiTypes";
import { AsyncStatus } from "../typings/enums";
import AsyncPage from "./AsyncPage";
import ScopeFilter from "./Filter/ScopeFilter/ScopeFilter";
import InfoItem from "./InfoItem/InfoItem";

type ScopeProps = {
  fetchScopeStatus: AsyncStatus;
  onChecklistClick: (checklistId: string) => void;
  scope?: ChecklistPreview[];
  isPoScope?: boolean;
  isIpoScope?: boolean;
  hideFilter?: boolean;
};

const Scope = ({
  fetchScopeStatus,
  onChecklistClick,
  scope,
  isPoScope,
  isIpoScope,
  hideFilter
}: ScopeProps): JSX.Element => {
  const [filteredScope, setFilteredScope] = useState<
    ChecklistPreview[] | undefined
  >();

  useEffect(() => {
    setFilteredScope(scope);
  }, [scope]);

  return (
    <AsyncPage
      errorMessage={"Unable to load scope. Please try again."}
      emptyContentMessage={"The scope is empty."}
      fetchStatus={fetchScopeStatus}
    >
      <div>
        {hideFilter ? null : (
          <ScopeFilter
            setFilteredScope={setFilteredScope}
            scopeItems={scope}
            isPoScope={isPoScope}
            isIpoScope={isIpoScope}
          />
        )}
        {filteredScope?.map((checklist) => (
          <InfoItem
            isScope
            key={checklist.id}
            attachments={checklist.attachmentCount}
            status={checklist.status}
            statusLetters={[
              checklist.isSigned ? "S" : null,
              checklist.isVerified ? "V" : null
            ]}
            headerText={checklist.tagNo.toString()}
            description={checklist.tagDescription}
            chips={[
              checklist.formularType,
              checklist.responsibleCode,
              checklist.mcPkgNo ? checklist.mcPkgNo : ""
            ]}
            onClick={(): void => onChecklistClick(`${checklist.id}`)}
          />
        ))}
      </div>
    </AsyncPage>
  );
};

export default Scope;
