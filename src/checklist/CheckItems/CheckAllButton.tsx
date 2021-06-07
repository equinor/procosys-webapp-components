import React, { useState } from 'react';
import {
    AsyncStatus,
    CheckItem,
    CustomCheckItem,
} from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { ProcosysApiService } from '../../services/procosysApi';
import updateCheck from '../../utils/updateCheck';
import updateCustomCheck from '../../utils/updateCustomCheck';
import updateNA from '../../utils/updateNA';

const StyledCheckAllButton = styled(Button)`
    :disabled {
        margin: 18px 4px 0 auto;
    }
    margin: 18px 4px 0 auto;
`;

type CheckAllButtonProps = {
    checkItems: CheckItem[];
    customCheckItems: CustomCheckItem[];
    setCheckItems: React.Dispatch<React.SetStateAction<CheckItem[]>>;
    setCustomCheckItems: React.Dispatch<
        React.SetStateAction<CustomCheckItem[]>
    >;
    allItemsCheckedOrNA: boolean;
    setSnackbarText: (message: string) => void;
    api: ProcosysApiService;
};

const CheckAllButton = ({
    checkItems,
    customCheckItems,
    setCheckItems,
    setCustomCheckItems,
    allItemsCheckedOrNA,
    setSnackbarText,
    api,
}: CheckAllButtonProps): JSX.Element => {
    const [checkAllStatus, setCheckAllStatus] = useState(AsyncStatus.INACTIVE);
    const checkAll = async (): Promise<void> => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToCheck = checkItems.filter(
            (item) => !item.isOk && !item.isNotApplicable
        );
        const customItemsToCheck = customCheckItems.filter(
            (item) => !item.isOk
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return api.postSetOk(item.id);
                })
            );
            await Promise.all(
                customItemsToCheck.map((item) => {
                    return api.postCustomSetOk(item.id);
                })
            );
            itemsToCheck.forEach((item) =>
                updateCheck({
                    value: true,
                    checkItemId: item.id,
                    setItems: setCheckItems,
                })
            );
            customItemsToCheck.forEach((item) =>
                updateCustomCheck({
                    value: true,
                    checkItemId: item.id,
                    setItems: setCustomCheckItems,
                })
            );
            setCheckAllStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Changes saved.');
        } catch (error) {
            setCheckAllStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save changes.');
        }
    };

    const clearAll = async (): Promise<void> => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToClear = checkItems.filter(
            (item) => !item.isHeading && (item.isOk || item.isNotApplicable)
        );
        const customItemsToClear = customCheckItems.filter((item) => item.isOk);
        try {
            await Promise.all(
                itemsToClear.map((item) => {
                    return api.postClear(item.id);
                })
            );
            await Promise.all(
                customItemsToClear.map((item) => {
                    return api.postCustomClear(item.id);
                })
            );
            itemsToClear.forEach((item) => {
                updateCheck({
                    value: false,
                    checkItemId: item.id,
                    setItems: setCheckItems,
                });
                updateNA({
                    value: false,
                    checkItemId: item.id,
                    setItems: setCheckItems,
                });
            });
            customItemsToClear.forEach((item) =>
                updateCustomCheck({
                    value: false,
                    checkItemId: item.id,
                    setItems: setCustomCheckItems,
                })
            );
            setCheckAllStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Clear complete.');
        } catch (error) {
            setCheckAllStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to clear fields.');
        }
    };

    return (
        <StyledCheckAllButton
            onClick={allItemsCheckedOrNA ? clearAll : checkAll}
            disabled={checkAllStatus === AsyncStatus.LOADING}
            variant={'outlined'}
        >
            {/* <EdsIcon
                name={allItemsCheckedOrNA ? 'checkbox' : 'checkbox_outline'}
            /> */}
            {allItemsCheckedOrNA ? 'Clear all' : 'Check all'}
        </StyledCheckAllButton>
    );
};

export default CheckAllButton;
