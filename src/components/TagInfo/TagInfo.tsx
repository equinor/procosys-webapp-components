import CollapsibleCard from '../CollapsibleCard';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import AsyncPage from './AsyncPage';
import { AsyncStatus } from '../contexts/McAppContext';
import { AdditionalTagField, TagDetails } from '../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import InfoRow from './InfoRow';
import AdditionalFieldRow from './AdditionalFieldRow';

// const InfoRow = styled.div`
//     & > p {
//         margin: 0;
//         margin-bottom: 12px;
//     }
//     & > label {
//         color: ${COLORS.darkGrey};
//     }
// `;

// export const TagInfoWrapper = styled.main`
//     min-height: calc(100vh - 203px);
//     margin-bottom: 66px;
//     box-sizing: border-box;
//     padding: 16px 4%;
// `;

type TagInfoProps = {
    tagId?: number;
};

const TagInfo = ({ tagId }: TagInfoProps): JSX.Element => {
    const [fetchTagStatus, setFetchTagStatus] = useState(AsyncStatus.LOADING);
    const [tagInfo, setTagInfo] = useState<TagDetails>();
    const [additionalFields, setAdditionalFields] = useState<
        AdditionalTagField[]
    >([]);

    // const infoRow = (
    //     label: string,
    //     value: string | null | undefined,
    //     code?: string | null
    // ): JSX.Element => {
    //     return (
    //         <InfoRow>
    //             <label>{label}</label>
    //             <p>
    //                 {code ? `${code}, ` : ''}
    //                 {value ?? '-'}
    //             </p>
    //         </InfoRow>
    //     );
    // };

    // const isValidValue = (value: string | null): boolean => {
    //     if (typeof value === 'string' && value.length > 0) return true;
    //     return false;
    // };

    // const additionalFieldRow = (
    //     label: string,
    //     value: string | null,
    //     unit: string | null,
    //     key: number
    // ): JSX.Element => {
    //     return (
    //         <TagInfoWrapper key={key}>
    //             <label>{label}</label>
    //             <p>
    //                 {isValidValue(value) ? value : '-'}{' '}
    //                 {isValidValue(value) && isValidValue(unit) ? unit : ''}
    //             </p>
    //         </TagInfoWrapper>
    //     );
    // };

    return (
        // <AsyncPage
        //     fetchStatus={fetchTagStatus}
        //     errorMessage={'Unable to load tag info. Please try again.'}
        // >
        //     <TagInfoWrapper>
        <>
            <CollapsibleCard cardTitle={'Main tag info'}>
                {InfoRow('Tag number', tagInfo?.tagNo)}
                {InfoRow('Description', tagInfo?.description)}
                {InfoRow(
                    'Register',
                    tagInfo?.registerCode,
                    tagInfo?.registerDescription
                )}
                {InfoRow(
                    'Tag function',
                    tagInfo?.tagFunctionDescription,
                    tagInfo?.tagFunctionCode
                )}
                {InfoRow(
                    'System',
                    tagInfo?.systemDescription,
                    tagInfo?.systemCode
                )}
                {InfoRow('Sequence', tagInfo?.sequence)}
                {InfoRow(
                    'Discipline',
                    tagInfo?.disciplineDescription,
                    tagInfo?.disciplineCode
                )}
                {InfoRow('Area', tagInfo?.areaDescription, tagInfo?.areaCode)}
                {InfoRow('Project', tagInfo?.projectDescription)}
                {InfoRow('MC Pkg', tagInfo?.mcPkgNo)}
                {InfoRow('Purchase order', tagInfo?.purchaseOrderTitle)}
                {InfoRow(
                    'Status',
                    tagInfo?.statusDescription,
                    tagInfo?.statusCode
                )}
                {InfoRow(
                    'Engineering',
                    tagInfo?.engineeringCodeDescription,
                    tagInfo?.engineeringCodeCode
                )}
                {InfoRow(
                    'Contractor',
                    tagInfo?.contractorDescription,
                    tagInfo?.contractorCode
                )}
                {InfoRow('Mounted on', tagInfo?.mountedOnTagNo)}
                {InfoRow('Remark', tagInfo?.remark)}
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
        </>
        //     </TagInfoWrapper>
        // </AsyncPage>
    );
};

export default TagInfo;
