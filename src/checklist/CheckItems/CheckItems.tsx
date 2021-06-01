import React from 'react';
import styled from 'styled-components';
import { CheckItem as CheckItemType } from '../../services/apiTypes';
import CheckItem from './CheckItem/CheckItem';
import CheckHeader from './CheckHeader';
import { ProcosysApiService } from '../../services/procosysApi';

const CheckItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    & div:first-of-type {
        margin-top: 0;
    }
    & > div {
        &:first-child {
            margin-top: 16px;
        }
    }
`;

type CheckItemsProps = {
    checkItems: CheckItemType[];
    setCheckItems: React.Dispatch<React.SetStateAction<CheckItemType[]>>;
    isSigned: boolean;
    allItemsCheckedOrNA: boolean;
    setSnackbarText: (message: string) => void;
    api: ProcosysApiService;
};

const CheckItems = ({
    checkItems,
    setCheckItems,
    isSigned,
    setSnackbarText,
    api,
}: CheckItemsProps): JSX.Element => {
    const determineCheckItem = (
        item: CheckItemType,
        index: number
    ): JSX.Element => {
        if (item.isHeading) {
            return <CheckHeader text={item.text} addLabels={index === 0} />;
        }
        // Return "OK / NA" labels if the first check item is not a heading.
        return (
            <>
                {index === 0 ? (
                    <CheckHeader text="" addLabels={index === 0} />
                ) : null}
                <CheckItem
                    item={item}
                    setCheckItems={setCheckItems}
                    isSigned={isSigned}
                    setSnackbarText={setSnackbarText}
                    api={api}
                />
            </>
        );
    };

    const itemsToDisplay = checkItems.map((item, index) => {
        return (
            <React.Fragment key={item.id}>
                {determineCheckItem(item, index)}
            </React.Fragment>
        );
    });

    return <CheckItemsWrapper>{itemsToDisplay}</CheckItemsWrapper>;
};

export default CheckItems;
