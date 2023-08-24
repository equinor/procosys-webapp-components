import React, { useEffect, useState } from 'react';
import { Label, TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { ProcosysApiService } from '../../../../../services/procosysApi';
import { AsyncStatus } from '../../../../../typings/enums';
import { Cell } from '../../../../../typings/apiTypes';
import { COLORS } from '../../../../../style/GlobalStyles';
import ChecklistV2Api from '../../../checklistV2Api';

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
    api: ChecklistV2Api;
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
    const [valueBeforeFocus, setValueBeforeFocus] = useState<string>('');
    const [inputValueDate, setInputValueDate] =
        useState<string>(formattedValueDate);
    const [inputValueString, setInputValueString] =
        useState<string>(formattedValueString);
    const [submitStatus, setSubmitStatus] = useState<AsyncStatus>(
        AsyncStatus.INACTIVE
    );
    const [errorMessage, setErrorMessage] = useState('');

    const putStringCellApiCall = async (): Promise<void> => {
        api.putMetaTableStringCell(
            checkItemId,
            cell.columnId,
            rowId,
            inputValueString
        );
        setValueBeforeFocus(inputValueString);
    };

    const putDateCellApiCall = (): Promise<void> =>
        api.putMetaTableDateCell(
            checkItemId,
            cell.columnId,
            rowId,
            inputValueDate
        );
    const dateId = `${cell.columnId}-date`;

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
                        onBlur={(): void => {
                            submitData(putDateCellApiCall);
                        }}
                        onChange={(
                            event: React.ChangeEvent<
                                HTMLTextAreaElement | HTMLInputElement
                            >
                        ): void => {
                            setInputValueDate(event.target.value);
                        }}
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
                        undefined
                    }
                    onFocus={(
                        e: React.FocusEvent<
                            HTMLTextAreaElement | HTMLInputElement
                        >
                    ): void => {
                        setValueBeforeFocus(e.target.value);
                    }}
                    onBlur={(
                        e: React.FocusEvent<
                            HTMLTextAreaElement | HTMLInputElement
                        >
                    ): void => {
                        e.target.value !== valueBeforeFocus &&
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
