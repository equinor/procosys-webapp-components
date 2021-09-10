import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import AsyncPage from '../components/AsyncPage';
import Filter from '../components/Filter/Filter';
import InfoItem from '../InfoItem/InfoItem';
import { AsyncStatus, PunchPreview } from '../services/apiTypes';
import removeSubdirectories from '../utils/removeSubdirectories';

const FillHeightWrapper = styled.div`
    min-height: calc(100vh - 203px);
    margin-bottom: 66px;
    box-sizing: border-box;
`;

type ChecklistPunchListProps = {
    url: string;
    fetchPunchListStatus: AsyncStatus;
    punchList?: PunchPreview[];
};

const ChecklistPunchList = ({
    url,
    fetchPunchListStatus,
    punchList,
}: ChecklistPunchListProps): JSX.Element => {
    const history = useHistory();
    const [filteredPunchList, setFilteredPunchList] = useState<
        PunchPreview[] | undefined
    >(punchList);
    return (
        <AsyncPage
            fetchStatus={fetchPunchListStatus}
            errorMessage={'Unable to get punch list. Please try again.'}
            emptyContentMessage={'The punch list is empty.'}
        >
            <FillHeightWrapper>
                <Filter
                    url={url}
                    setShownPunches={setFilteredPunchList}
                    punchItems={punchList}
                    isChecklistPunchList
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
                        onClick={(): void =>
                            history.push(
                                `${removeSubdirectories(url)}/punch-item/${
                                    punch.id
                                }`
                            )
                        }
                    />
                ))}
            </FillHeightWrapper>
        </AsyncPage>
    );
};

export default ChecklistPunchList;
