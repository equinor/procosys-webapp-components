import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    CheckItem as CheckItemType,
    ChecklistDetails,
} from '../../services/apiTypes';
import CheckItem from './CheckItem/CheckItem';
import CheckHeader from './CheckHeader';
import CheckAllButton from './CheckAllButton';
import { ProcosysApiService } from '../../services/procosysApi';

const CheckItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    & div:first-of-type {
        margin-top: 0;
    }
    & > div {
        &:first-child {
            margin-top: 16px;
        }
    }
`;

const determineIfAllAreCheckedOrNA = (
    itemsToDetermine: CheckItemType[]
): boolean => {
    return itemsToDetermine.every((item) => item.isOk || item.isNotApplicable);
};

type CheckItemsProps = {
    checkItems: CheckItemType[];
    details: ChecklistDetails;
    isSigned: boolean;
    setAllItemsCheckedOrNA: React.Dispatch<React.SetStateAction<boolean>>;
    allItemsCheckedOrNA: boolean;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    api: ProcosysApiService;
};

const CheckItems = ({
    checkItems,
    details,
    isSigned,
    allItemsCheckedOrNA,
    setAllItemsCheckedOrNA,
    setSnackbarText,
    api,
}: CheckItemsProps): JSX.Element => {
    const [items, setItems] = useState(checkItems);

    useEffect(() => {
        setAllItemsCheckedOrNA(determineIfAllAreCheckedOrNA(items));
    }, [items, setAllItemsCheckedOrNA]);

    const updateNA = (value: boolean, checkItemId: number): void => {
        setItems((items) =>
            items.map((existingItem) =>
                existingItem.id === checkItemId
                    ? { ...existingItem, isNotApplicable: value }
                    : existingItem
            )
        );
    };

    const updateOk = (value: boolean, checkItemId: number): void => {
        setItems((items) =>
            items.map((existingItem) =>
                existingItem.id === checkItemId
                    ? { ...existingItem, isOk: value }
                    : existingItem
            )
        );
    };

    const determineCheckItem = (
        item: CheckItemType,
        index: number,
        nextItemIsHeading: boolean
    ): JSX.Element => {
        if (item.isHeading && nextItemIsHeading) {
            return <></>;
        }
        if (item.isHeading) {
            return (
                <CheckHeader
                    text={item.text}
                    removeLabels={nextItemIsHeading}
                />
            );
        }
        // Return "OK / NA" labels if the first check item is not a heading.
        return (
            <>
                {index === 0 ? <CheckHeader text="" /> : null}
                <CheckItem
                    item={item}
                    updateNA={updateNA}
                    updateOk={updateOk}
                    checklistId={details.id}
                    isSigned={isSigned}
                    setSnackbarText={setSnackbarText}
                    api={api}
                />
            </>
        );
    };

    const itemsToDisplay = items.map((item, index) => {
        const nextItemIsHeading = items[index + 1]
            ? items[index + 1].isHeading
            : true;
        return (
            <React.Fragment key={item.id}>
                {determineCheckItem(item, index, nextItemIsHeading)}
            </React.Fragment>
        );
    });

    return (
        <CheckItemsWrapper>
            {!isSigned && (
                <CheckAllButton
                    setSnackbarText={setSnackbarText}
                    allItemsCheckedOrNA={allItemsCheckedOrNA}
                    items={items}
                    updateOk={updateOk}
                    api={api}
                />
            )}
            {itemsToDisplay}
        </CheckItemsWrapper>
    );
};

export default CheckItems;
