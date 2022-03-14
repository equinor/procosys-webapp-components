import styled, { CSSObject } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { createGlobalStyle } from 'styled-components';

export const SHADOW =
    '0 0.3px 0.9px rgba(33, 41, 43, 0.04), 0 0.9px 3.1px rgba(33, 41, 43, 0.07), 0 4px 14px rgba(33, 41, 43, 0.1)';

export const COLORS = {
    mossGreen: tokens.colors.interactive.primary__resting.hex,
    fadedBlue: tokens.colors.interactive.primary__hover_alt.hex,
    danger: tokens.colors.interactive.danger__resting.hex,
    success: tokens.colors.interactive.success__resting.hex,
    midnight: '#243746',
    red: '#ff1343',
    white: '#fff',
    darkGrey: '#757575',
    lightGrey: '#fafafa',
    greyBackground: tokens.colors.ui.background__light.hex,
    disabledText: tokens.colors.interactive.disabled__text.hex,
    black: '#000',
};

const GlobalStyles = createGlobalStyle`
    h1 {
        ${tokens.typography.heading.h1 as CSSObject}
    }
    h2 {
        ${tokens.typography.heading.h2 as CSSObject}
    }
    h3 {
        ${tokens.typography.heading.h3 as CSSObject}
    }
    h4 {
        ${tokens.typography.heading.h4 as CSSObject}
    }
    h5 {
        ${tokens.typography.heading.h5 as CSSObject}
    }
    h6 {
        ${tokens.typography.heading.h6 as CSSObject}
    }
    p {
        ${tokens.typography.paragraph.body_short as CSSObject}
    }
    a {
        ${tokens.typography.paragraph.body_short_link as CSSObject}
    }
    hr {
        width: 100%;
    }
    label {
        ${tokens.typography.input.label as CSSObject}
    }
    caption { 
        ${tokens.typography.paragraph.caption as CSSObject}
    }
`;

export const Caption = styled.p({
    color: 'rgba(61, 61, 61, 1)',
    fontFamily: 'Equinor',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: '1.143em',
    textAlign: 'left',
});

export const BREAKPOINT = {
    xs: '@media (max-width: 0px)',
    sm: '@media (max-width: 600px)',
    standard: '@media (max-width: 768px)',
    md: '@media (max-width: 960px)',
    lg: '@media (max-width: 1280px)',
    xl: '@media (max-width: 1920px)',
};

export default GlobalStyles;
