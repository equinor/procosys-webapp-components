import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../icons/EdsIcon';

const ShowMoreButtonWrapper = styled.div`
    & button {
        margin: 0;
        padding: 0;
        border: 0;
        background: none;
        display: flex;
        align-items: center;
        & p {
            margin: 0;
            color: ${COLORS.mossGreen};
        }
    }
`;

type ShowMoreButtonProps = {
    toggleShowMore: React.Dispatch<React.SetStateAction<boolean>>;
    showCondition: boolean;
    showText: string;
    hideText: string;
};

const ShowMoreButton = ({
    toggleShowMore,
    showCondition,
    showText,
    hideText,
}: ShowMoreButtonProps): JSX.Element => {
    return (
        <ShowMoreButtonWrapper>
            <button
                onClick={(): void => toggleShowMore((prevState) => !prevState)}
            >
                <p>{showCondition ? hideText : showText}</p>
                <EdsIcon
                    name={showCondition ? 'chevron_down' : 'chevron_right'}
                    size={16}
                />
            </button>
        </ShowMoreButtonWrapper>
    );
};

export default ShowMoreButton;
