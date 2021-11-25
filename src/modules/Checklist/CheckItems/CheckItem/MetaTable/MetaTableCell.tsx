import { TextField } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ProcosysApiService } from '../../../../../services/procosysApi';
import { AsyncStatus } from '../../../../../typings/enums';
import DatePicker from '../../../../components/datePicker/DatePicker';

const HelperText = styled.div`
    height: 12px;
    margin-top: 2px;
    margin-left: 8px;
    & p {
        margin: 0;
        font-size: 12px;
    }
`;

type MetaTableCellType = 'text' | 'date';

export type MetaTableCellProps = {
    checkItemId: number;
    rowId: number;
    columnId: number;
    value: string;
    unit: string;
    disabled: boolean;
    label: string;
    api: ProcosysApiService;
    type: MetaTableCellType;
};

function determineHelperText(submitStatus: AsyncStatus): string {
    if (submitStatus === AsyncStatus.ERROR) return 'Unable to save.';
    if (submitStatus === AsyncStatus.LOADING) return 'Saving data...';
    if (submitStatus === AsyncStatus.SUCCESS) return 'Data saved.';
    return '';
}

const MetaTableCell = ({
    value,
    unit,
    disabled,
    rowId,
    columnId,
    checkItemId,
    label,
    api,
    type,
}: MetaTableCellProps): JSX.Element => {
    const [inputValue, setInputValue] = useState(value);
    const [submitStatus, setSubmitStatus] = useState<AsyncStatus>(
        AsyncStatus.INACTIVE
    );
    const [errorMessage, setErrorMessage] = useState('');
    let valueBeforeFocus = '';

    const submitData = async (): Promise<void> => {
        setSubmitStatus(AsyncStatus.LOADING);
        try {
            await api.putMetaTableCell(
                checkItemId,
                columnId,
                rowId,
                inputValue
            );
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
            {type === 'date' ? (
                <DatePicker
                    label={label}
                    id={rowId.toString() + columnId.toString() + 'textfield'}
                    value={inputValue ? inputValue : ''}
                    disabled={disabled}
                    onBlur={(): void => {
                        value !== valueBeforeFocus && submitData();
                    }}
                    onChange={(
                        event: React.ChangeEvent<
                            HTMLTextAreaElement | HTMLInputElement
                        >
                    ): void => setInputValue(event.target.value)}
                />
            ) : (
                <TextField
                    id={rowId.toString() + columnId.toString() + 'textfield'}
                    meta={unit}
                    label={label}
                    value={inputValue ? inputValue : ''}
                    disabled={disabled}
                    variant={
                        (submitStatus === AsyncStatus.ERROR && 'error') ||
                        (submitStatus === AsyncStatus.SUCCESS && 'success') ||
                        'default'
                    }
                    onFocus={(): string => (valueBeforeFocus = value)}
                    onBlur={(): void => {
                        value !== valueBeforeFocus && submitData();
                    }}
                    onChange={(
                        event: React.ChangeEvent<
                            HTMLTextAreaElement | HTMLInputElement
                        >
                    ): void => setInputValue(event.target.value)}
                />
            )}
            <HelperText>
                <p>{determineHelperText(submitStatus)}</p>
            </HelperText>
        </td>
    );
};

export default MetaTableCell;
