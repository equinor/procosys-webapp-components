import React, { useEffect, useState } from 'react';
import { Label, TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { ProcosysApiService } from '../../../../../services/procosysApi';
import { AsyncStatus } from '../../../../../typings/enums';
import { Cell } from '../../../../../typings/apiTypes';
import { COLORS } from '../../../../../style/GlobalStyles';

const HelperText = styled.div`
    height: 12px;
    margin-top: 2px;
    margin-left: 8px;
    & p {
        margin: 0;
        font-size: 12px;
    }
`;

const MetaTableDateCellWrapper = styled.div`
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

export type MetaTableCellProps = {
    checkItemId: number;
    rowId: number;
    cell: Cell;
    disabled: boolean;
    label: string;
    api: ProcosysApiService;
};

function determineHelperText(submitStatus: AsyncStatus): string {
    if (submitStatus === AsyncStatus.ERROR) return 'Unable to save.';
    if (submitStatus === AsyncStatus.LOADING) return 'Saving data...';
    if (submitStatus === AsyncStatus.SUCCESS) return 'Data saved.';
    return '';
}

const MetaTableCell = ({
    disabled,
    rowId,
    cell,
    checkItemId,
    label,
    api,
}: MetaTableCellProps): JSX.Element => {
    const formattedValueDate = cell.valueDate
        ? cell.valueDate.substring(0, 10)
        : '';
    const formattedValueString = cell.value ?? '';
    const [inputValueDate, setInputValueDate] = useState(formattedValueDate);
    const [inputValueString, setInputValueString] =
        useState(formattedValueString);
    const [submitStatus, setSubmitStatus] = useState<AsyncStatus>(
        AsyncStatus.INACTIVE
    );
    const [errorMessage, setErrorMessage] = useState('');
    const putStringCellApiCall = (): Promise<void> =>
        api.putMetaTableStringCell(
            checkItemId,
            cell.columnId,
            rowId,
            inputValueDate
        );
    const putDateCellApiCall = (): Promise<void> =>
        api.putMetaTableDateCell(
            checkItemId,
            cell.columnId,
            rowId,
            inputValueDate
        );
    const dateId = `${cell.columnId}-date`;
    let valueBeforeFocus = '';

    const submitData = async (
        updateDataApiCall: () => Promise<void>
    ): Promise<void> => {
        setSubmitStatus(AsyncStatus.LOADING);
        try {
            await updateDataApiCall();
            setSubmitStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setErrorMessage(error.toString());
            setSubmitStatus(AsyncStatus.ERROR);
        }
    };

    useEffect(() => {
        if (submitStatus !== AsyncStatus.SUCCESS) return;
        const timerId = setTimeout(() => {
            setSubmitStatus(AsyncStatus.INACTIVE);
        }, 2000);
        return (): void => clearTimeout(timerId);
    }, [submitStatus]);

    return (
        <td>
            {cell.isValueDate ? (
                <MetaTableDateCellWrapper>
                    {label && <Label label={label} htmlFor={dateId} />}
                    <input
                        disabled={disabled}
                        type="date"
                        id={dateId}
                        role="datepicker"
                        value={inputValueDate}
                        onFocus={(): string => (valueBeforeFocus = cell.value)}
                        onBlur={(): void => {
                            cell.value !== valueBeforeFocus &&
                                submitData(putDateCellApiCall);
                        }}
                        onChange={(
                            event: React.ChangeEvent<
                                HTMLTextAreaElement | HTMLInputElement
                            >
                        ): void => setInputValueDate(event.target.value)}
                    />
                </MetaTableDateCellWrapper>
            ) : (
                <TextField
                    id={
                        rowId.toString() +
                        cell.columnId.toString() +
                        'textfield'
                    }
                    meta={cell.unit}
                    label={label}
                    value={inputValueString}
                    disabled={disabled}
                    variant={
                        (submitStatus === AsyncStatus.ERROR && 'error') ||
                        (submitStatus === AsyncStatus.SUCCESS && 'success') ||
                        'default'
                    }
                    onFocus={(): string => (valueBeforeFocus = cell.value)}
                    onBlur={(): void => {
                        cell.value !== valueBeforeFocus &&
                            submitData(putStringCellApiCall);
                    }}
                    onChange={(
                        event: React.ChangeEvent<
                            HTMLTextAreaElement | HTMLInputElement
                        >
                    ): void => setInputValueString(event.target.value)}
                />
            )}

            <HelperText>
                <p>{determineHelperText(submitStatus)}</p>
            </HelperText>
        </td>
    );
};

export default MetaTableCell;
