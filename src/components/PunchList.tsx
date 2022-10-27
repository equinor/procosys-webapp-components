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
    isIpoPunchList?: boolean;
};

const PunchList = ({
    fetchPunchListStatus,
    onPunchClick,
    punchList,
    isChecklistPunchList,
    isPoPunchList,
    isIpoPunchList,
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
                    isIpoPunchList={isIpoPunchList}
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
                        headerText={
                            punch.id < 0
                                ? `${punch.id.toString()} (temp. offline ID)`
                                : punch.id.toString()
                        }
                        description={punch.description}
                        chips={
                            isChecklistPunchList
                                ? undefined
                                : [
                                      punch.formularType,
                                      punch.responsibleCode,
                                      punch.mcPkgNo ? punch.mcPkgNo : '',
                                  ]
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
