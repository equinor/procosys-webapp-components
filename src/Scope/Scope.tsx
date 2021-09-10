import React, { useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import AsyncPage from '../components/AsyncPage';
import Filter from '../components/Filter/Filter';
import InfoItem from '../InfoItem/InfoItem';
import { AsyncStatus, ChecklistPreview } from '../services/apiTypes';

export const ScopeWrapper = styled.div`
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

type ScopeProps = {
    fetchScopeStatus: AsyncStatus;
    scope?: ChecklistPreview[];
};

const Scope = ({ fetchScopeStatus, scope }: ScopeProps): JSX.Element => {
    const history = useHistory();
    const [shownScope, setShownScope] = useState<
        ChecklistPreview[] | undefined
    >(scope);

    return (
        <ScopeWrapper>
            <AsyncPage
                errorMessage={'Unable to load scope. Please try again.'}
                emptyContentMessage={'The scope is empty.'}
                fetchStatus={fetchScopeStatus}
            >
                <div>
                    <Filter
                        url={history.location.pathname}
                        setShownScope={setShownScope}
                        scopeItems={scope}
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
                            onClick={(): void =>
                                history.push(
                                    `${history.location.pathname}/checklist/${checklist.id}`
                                )
                            }
                        />
                    ))}
                </div>
            </AsyncPage>
        </ScopeWrapper>
    );
};

export default Scope;
