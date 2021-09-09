import React from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';

const SearchTypeButtonWrapper = styled(Button)<{ active: boolean }>`
    background-color: ${(props): string =>
        props.active ? COLORS.fadedBlue : COLORS.white};
    flex: 1;
    height: 100%;
`;

type SearchTypeButtonProps = {
    searchType: string;
    currentSearchType: string | null;
    setCurrentSearchType: React.Dispatch<React.SetStateAction<string | null>>;
};

const SearchTypeButton = ({
    searchType,
    currentSearchType,
    setCurrentSearchType,
}: SearchTypeButtonProps): JSX.Element => {
    return (
        <SearchTypeButtonWrapper
            variant={'outlined'}
            onClick={(): void => {
                setCurrentSearchType(
                    searchType === currentSearchType ? null : searchType
                );
            }}
            active={searchType === currentSearchType}
        >
            {searchType}
        </SearchTypeButtonWrapper>
    );
};

export default SearchTypeButton;
