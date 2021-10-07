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
    handleOnClick: () => void;
    showCondition: boolean;
    showText: string;
    hideText: string;
};

const ShowMoreButton = ({
    handleOnClick,
    showCondition,
    showText,
    hideText,
}: ShowMoreButtonProps): JSX.Element => {
    return (
        <ShowMoreButtonWrapper>
            <button onClick={handleOnClick}>
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
