import React, { useState } from 'react';
import AsyncPage from './AsyncPage';
import ScopeFilter from './Filter/ScopeFilter/ScopeFilter';
import InfoItem from './InfoItem/InfoItem';
import { ChecklistPreview } from '../typings/apiTypes';
import { AsyncStatus } from '../typings/enums';

type ScopeProps = {
    fetchScopeStatus: AsyncStatus;
    onChecklistClick: (checklistId: number) => void;
    scope?: ChecklistPreview[];
    isPoScope?: boolean;
};

const Scope = ({
    fetchScopeStatus,
    onChecklistClick,
    scope,
    isPoScope,
}: ScopeProps): JSX.Element => {
    const [shownScope, setShownScope] = useState<
        ChecklistPreview[] | undefined
    >(scope);

    return (
        <AsyncPage
            errorMessage={'Unable to load scope. Please try again.'}
            emptyContentMessage={'The scope is empty.'}
            fetchStatus={fetchScopeStatus}
        >
            <div>
                <ScopeFilter
                    setShownScope={setShownScope}
                    scopeItems={scope}
                    isPoScope={isPoScope}
                />
                {shownScope?.map((checklist) => (
                    <InfoItem
                        isScope
                        key={checklist.id}
                        attachments={checklist.attachmentCount}
                        status={checklist.status}
                        statusLetters={[
                            checklist.isSigned ? 'S' : null,
                            checklist.isVerified ? 'V' : null,
                        ]}
                        headerText={checklist.tagNo.toString()}
                        description={checklist.tagDescription}
                        chips={[
                            checklist.formularType,
                            checklist.responsibleCode,
                        ]}
                        onClick={(): void => onChecklistClick(checklist.id)}
                    />
                ))}
            </div>
        </AsyncPage>
    );
};

export default Scope;
