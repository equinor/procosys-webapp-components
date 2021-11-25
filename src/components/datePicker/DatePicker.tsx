import { Label } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

export const DateField = styled.div`
    & > input {
        box-sizing: border-box;
        width: 100%;
        min-width: 95%;
        background-color: ${COLORS.greyBackground};
        height: 40px;
        border: none;
        box-shadow: inset 0 -1px 0 0 var(--eds_text__static_ic, rgba(111, 111, 111, 1)); // TODO: fix(?)
        font-family: Equinor;
        padding: 0 8px;
    }
    & > input:focus-visible {
        outline: 2px solid ${COLORS.mossGreen};
        box-shadow: none;
    }
`;

export interface DatePickerProps {
    id: string;
    value?: string;
    disabled?: boolean;
    label?: string;
    onChange?: (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
    onBlur?: (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
}

const DatePicker = ({
    id,
    value,
    label,
    ...rest
}: DatePickerProps): JSX.Element => {
    const dateId = `${id}-date`;
    return (
        <DateField>
            {label && <Label label={label} htmlFor={dateId} />}
            <input
                type="date"
                id={dateId}
                role="datepicker"
                value={value ? value : ''}
                {...rest}
            />
        </DateField>
    );
};

export default DatePicker;
