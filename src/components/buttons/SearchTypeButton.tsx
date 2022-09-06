import React from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';

const SearchTypeButtonWrapper = styled(Button)<{
    active: boolean;
}>`
    background-color: ${(props): string =>
        props.active ? COLORS.fadedBlue : COLORS.white};
    flex: 1;
    height: 100%;
`;

type SearchTypeButtonProps = {
    searchType: string;
    currentSearchType: string | undefined;
    setCurrentSearchType: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    disabled?: boolean;
};

const SearchTypeButton = ({
    searchType,
    currentSearchType,
    setCurrentSearchType,
    disabled,
}: SearchTypeButtonProps): JSX.Element => {
    return (
        <SearchTypeButtonWrapper
            variant={'outlined'}
            onClick={(): void => {
                setCurrentSearchType(
                    searchType === currentSearchType ? undefined : searchType
                );
            }}
            active={searchType === currentSearchType}
            disabled={disabled}
        >
            {searchType}
        </SearchTypeButtonWrapper>
    );
};

export default SearchTypeButton;
