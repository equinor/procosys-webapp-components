import React from 'react';
import { ScopeWrapper } from '../Scope/Scope';
import { useState } from 'react';
import { AsyncStatus, PunchPreview } from '../services/apiTypes';
import { useHistory } from 'react-router';
import AsyncPage from '../components/AsyncPage';
import InfoItem from '../InfoItem/InfoItem';
import PunchListFilter from '../components/Filter/PunchListFilter/PunchListFilter';

type PunchListProps = {
    fetchPunchListStatus: AsyncStatus;
    onPunchClick: (punchId: number) => void;
    punchList?: PunchPreview[];
    isChecklistPunchList?: boolean;
    isPoPunchList?: boolean;
};

const PunchList = ({
    fetchPunchListStatus,
    onPunchClick,
    punchList,
    isChecklistPunchList,
    isPoPunchList,
}: PunchListProps): JSX.Element => {
    const [filteredPunchList, setFilteredPunchList] = useState<
        PunchPreview[] | undefined
    >(punchList);

    return (
        <ScopeWrapper>
            <AsyncPage
                fetchStatus={fetchPunchListStatus}
                errorMessage={
                    'Error: Unable to get punch list. Please try again.'
                }
                emptyContentMessage={'The punch list is empty.'}
            >
                <>
                    <PunchListFilter
                        setShownPunches={setFilteredPunchList}
                        punchItems={punchList}
                        isChecklistPunchList={isChecklistPunchList}
                        isPoPunchList={isPoPunchList}
                    />
                    {filteredPunchList?.map((punch) => (
                        <InfoItem
                            key={punch.id}
                            status={punch.status}
                            statusLetters={[
                                punch.cleared ? 'C' : null,
                                punch.verified ? 'V' : null,
                            ]}
                            attachments={punch.attachmentCount}
                            headerText={punch.id.toString()}
                            description={punch.description}
                            chips={
                                isChecklistPunchList
                                    ? undefined
                                    : [
                                          punch.formularType,
                                          punch.responsibleCode,
                                      ]
                            }
                            tag={isChecklistPunchList ? undefined : punch.tagNo}
                            onClick={(): void => onPunchClick(punch.id)}
                        />
                    ))}
                </>
            </AsyncPage>
        </ScopeWrapper>
    );
};

export default PunchList;
