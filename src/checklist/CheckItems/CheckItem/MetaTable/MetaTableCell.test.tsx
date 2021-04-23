import { render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import MetaTableCell, { MetaTableCellProps } from './MetaTableCell';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ENDPOINTS, causeApiError } from '../../../../../test/setupServer';
import { withCommAppContext } from '../../../../../test/contexts';

jest.mock('../../../../../services/authService');
jest.useFakeTimers();

const metaTableCellTestProps: MetaTableCellProps = {
    checkItemId: 0,
    rowId: 0,
    columnId: 0,
    value: 'Test value',
    unit: 'Test unit',
    disabled: false,
    label: 'Test label',
};

const metaTableCellForTesting = withCommAppContext({
    Component: (
        <table>
            <tbody>
                <tr>
                    <MetaTableCell {...metaTableCellTestProps} />
                </tr>
            </tbody>
        </table>
    ),
});

async function setupWithInputTypedIn(): Promise<void> {
    render(metaTableCellForTesting);
    const input = await screen.findByDisplayValue(metaTableCellTestProps.value);
    userEvent.type(input, 's');
}

describe('<MetaTableCell>', () => {
    it('Renders correct label, unit and initial value', () => {
        render(metaTableCellForTesting);
        expect(screen.getByText('Test label')).toBeInTheDocument();
        expect(screen.getByText('Test unit')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
    });
    it('Renders whatever the user types into the input field.', async () => {
        await setupWithInputTypedIn();
        expect(screen.getByDisplayValue('Test values')).toBeInTheDocument();
    });
    it('Renders "Saving..."-message after exiting input field', async () => {
        await setupWithInputTypedIn();
        userEvent.tab();
        await waitForElementToBeRemoved(() =>
            screen.getByText('Saving data...')
        );
    });
    it('Renders "Data saved."-message upon successful save', async () => {
        await setupWithInputTypedIn();
        userEvent.tab();
        await waitForElementToBeRemoved(() =>
            screen.getByText('Saving data...')
        );
        await waitForElementToBeRemoved(() => screen.getByText('Data saved.'));
    });
    it('Renders "Unable to save." upon error', async () => {
        causeApiError(ENDPOINTS.putMetaTableCell, 'put');
        await setupWithInputTypedIn();
        userEvent.tab();
        await waitForElementToBeRemoved(() =>
            screen.getByText('Saving data...')
        );
        expect(screen.getByText('Unable to save.')).toBeInTheDocument();
    });
});
