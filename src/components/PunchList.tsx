import React, { useEffect } from 'react';
import { useState } from 'react';
import { PunchPreview } from '../typings/apiTypes';
import { AsyncStatus } from '../typings/enums';
import AsyncPage from './AsyncPage';
import PunchListFilter from './Filter/PunchListFilter/PunchListFilter';
import InfoItem from './InfoItem/InfoItem';

type PunchListProps = {
    fetchPunchListStatus: AsyncStatus;
    onPunchClick: (punch: PunchPreview) => void;
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
    >();

    useEffect(() => {
        setFilteredPunchList(punchList);
    }, [punchList]);

    return (
        <AsyncPage
            fetchStatus={fetchPunchListStatus}
            errorMessage={'Error: Unable to get punch list. Please try again.'}
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
                                : [punch.formularType, punch.responsibleCode]
                        }
                        tag={isChecklistPunchList ? undefined : punch.tagNo}
                        onClick={(): void => onPunchClick(punch)}
                    />
                ))}
            </>
        </AsyncPage>
    );
};

export default PunchList;
