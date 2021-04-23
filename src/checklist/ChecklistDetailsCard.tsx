import React, { useEffect } from 'react';
import styled from 'styled-components';
import CompletionStatusIcon from '../../components/icons/CompletionStatusIcon';
import { ChecklistDetails } from '../../services/apiTypes';
import { COLORS, SHADOW } from '../../style/GlobalStyles';

const FormularTypeText = styled.p`
    flex: 1;
`;

const TextWrapper = styled.div`
    flex: 3;
    padding-right: 15px;
    & p,
    h6 {
        margin: 0;
    }
`;

const ChecklistDetailsCardWrapper = styled.div<{ isSigned?: boolean }>`
    padding: 16px 4%;
    box-sizing: border-box;
    width: 100%;
    background-color: ${(props): string =>
        props.isSigned ? COLORS.fadedBlue : COLORS.lightGrey};
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: ${SHADOW};
    & img {
        max-width: 20px;
        margin: 10px 16px 10px 0px;
        flex: 1;
    }
    & ${FormularTypeText} {
        flex: 1;
        text-align: right;
        padding-right: 24px;
    }
`;

type ChecklistDetailsCardProps = {
    details: ChecklistDetails;
    descriptionLabel: string;
    isSigned?: boolean;
};

const ChecklistDetailsCard = ({
    details,
    isSigned,
    descriptionLabel,
}: ChecklistDetailsCardProps): JSX.Element => {
    return (
        <ChecklistDetailsCardWrapper isSigned={isSigned}>
            <CompletionStatusIcon status={details.status} />
            <TextWrapper>
                <label>{details.tagNo}</label>
                <p>{details.tagDescription}</p>
            </TextWrapper>
            <FormularTypeText>{details.formularType}</FormularTypeText>
        </ChecklistDetailsCardWrapper>
    );
};

export default ChecklistDetailsCard;
