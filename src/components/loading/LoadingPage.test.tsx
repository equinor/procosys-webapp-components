import { render } from '@testing-library/react';
import React from 'react';
import LoadingPage from './LoadingPage';

describe('<LoadingPage />', () => {
    it('Renders the loading page with loading text passed in', () => {
        const { getByText } = render(
            <LoadingPage loadingText="Test loading text" />
        );
        expect(getByText('Test loading text')).toBeInTheDocument();
    });
});
