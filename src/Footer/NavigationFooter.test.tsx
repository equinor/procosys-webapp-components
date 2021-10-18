import { render, screen, within } from '@testing-library/react';
import React from 'react';
import NavigationFooter from './NavigationFooter';
import { BrowserRouter as Router } from 'react-router-dom';
import { CompletionStatus } from '../../services/apiTypes';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import FooterButton from './FooterButton';

describe('<NavigationFooter>', () => {
    it('Renders navigation buttons and displays correct number of items', () => {
        render(
            <Router>
                <NavigationFooter>
                    <FooterButton
                        active={true}
                        goTo={jest.fn()}
                        icon={
                            <EdsIcon
                                name="check_circle_outlined"
                                color={COLORS.mossGreen}
                            />
                        }
                        label="test-label"
                        numberOfItems={222}
                    />
                </NavigationFooter>
            </Router>
        );
        const button = screen.getByRole('button', { name: 'test-label 222' });
        expect(button).toBeInTheDocument();
    });
});
