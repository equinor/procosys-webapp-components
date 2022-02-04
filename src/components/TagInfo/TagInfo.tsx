import CollapsibleCard from '../CollapsibleCard';
import React from 'react';
import styled from 'styled-components';
import AsyncPage from '../AsyncPage';
import { AsyncStatus } from '../../typings/enums';
import { AdditionalTagField, TagDetails } from '../../typings/apiTypes';
import InfoRow from './InfoRow';
import AdditionalFieldRow from './AdditionalFieldRow';

export const TagInfoWrapper = styled.main`
    min-height: calc(100vh - 203px);
    margin-bottom: 66px;
    box-sizing: border-box;
    padding: 16px 4%;
`;

type TagInfoProps = {
    tagInfo?: TagDetails;
    fetchTagStatus: AsyncStatus;
    additionalFields: AdditionalTagField[];
};

const TagInfo = ({
    tagInfo,
    fetchTagStatus,
    additionalFields,
}: TagInfoProps): JSX.Element => {
    return (
        <AsyncPage
            fetchStatus={fetchTagStatus}
            errorMessage={'Unable to load tag info. Please try again.'}
        >
            <TagInfoWrapper>
                <CollapsibleCard cardTitle={'Main tag info'}>
                    <InfoRow label="Tag number" value={tagInfo?.tagNo} />

                    <InfoRow label="Description" value={tagInfo?.description} />

                    <InfoRow
                        label="Register"
                        value={tagInfo?.registerDescription}
                        code={tagInfo?.registerCode}
                    />

                    <InfoRow
                        label="Tag function"
                        value={tagInfo?.tagFunctionDescription}
                        code={tagInfo?.tagFunctionCode}
                    />

                    <InfoRow
                        label="System"
                        value={tagInfo?.systemDescription}
                        code={tagInfo?.systemCode}
                    />

                    <InfoRow label="Sequence" value={tagInfo?.sequence} />

                    <InfoRow
                        label="Discipline"
                        value={tagInfo?.disciplineDescription}
                        code={tagInfo?.disciplineCode}
                    />

                    <InfoRow
                        label="Area"
                        value={tagInfo?.areaDescription}
                        code={tagInfo?.areaCode}
                    />

                    <InfoRow
                        label="Project"
                        value={tagInfo?.projectDescription}
                    />

                    <InfoRow label="MC Pkg" value={tagInfo?.mcPkgNo} />

                    <InfoRow
                        label="Purchase order"
                        value={tagInfo?.purchaseOrderTitle}
                    />

                    <InfoRow
                        label="Status"
                        value={tagInfo?.statusDescription}
                        code={tagInfo?.statusCode}
                    />

                    <InfoRow
                        label="Engineering"
                        value={tagInfo?.engineeringCodeDescription}
                        code={tagInfo?.engineeringCodeCode}
                    />

                    <InfoRow
                        label="Contractor"
                        value={tagInfo?.contractorDescription}
                        code={tagInfo?.contractorCode}
                    />

                    <InfoRow
                        label="Mounted on"
                        value={tagInfo?.mountedOnTagNo}
                    />

                    <InfoRow label="Remark" value={tagInfo?.remark} />
                </CollapsibleCard>
                <CollapsibleCard cardTitle={'Details'}>
                    {additionalFields.map((field) =>
                        AdditionalFieldRow(
                            field.label,
                            field.value,
                            field.unit,
                            field.id
                        )
                    )}
                </CollapsibleCard>
            </TagInfoWrapper>
        </AsyncPage>
    );
};

export default TagInfo;
