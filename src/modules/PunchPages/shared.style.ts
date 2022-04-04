import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

export const PunchFormWrapper = styled.form`
    background-color: ${COLORS.white};
    padding: 0 4% 66px 4%;
    overflow: hidden;
    & > div {
        margin-top: 16px;
    }
`;

export const FormButtonWrapper = styled.div`
    display: flex;
    margin: 16px 0;
    justify-content: flex-end;
`;

export const DateField = styled.div`
    & > input {
        box-sizing: border-box;
        width: 100%;
        min-width: 95%;
        background-color: ${COLORS.greyBackground};
        height: 40px;
        border: none;
        box-shadow: inset 0 -1px 0 0 var(--eds_text__static_ic, #6f6f6f);
        font-family: Equinor;
        padding: 0 8px;
    }
    & > input:focus-visible {
        outline: 2px solid ${COLORS.mossGreen};
        box-shadow: none;
    }
    & > input:disabled {
        box-shadow: none;
        color: ${COLORS.disabledText};
    }
`;

export const AttachmentsWrapper = styled.div`
    margin: 0 -4% 16px -4%;
    padding: 16px 4%;
    background-color: ${COLORS.fadedBlue};
    height: 100px;
`;
