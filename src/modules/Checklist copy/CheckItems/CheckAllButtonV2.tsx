import React, { useState } from 'react';
import { CheckItem, CustomCheckItem } from '../../../typings/apiTypes';
import { Button } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { ProcosysApiService } from '../../../services/procosysApi';
import updateCheck from '../../../utils/updateCheck';
import updateCustomCheck from '../../../utils/updateCustomCheck';
import updateNA from '../../../utils/updateNA';
import { AsyncStatus } from '../../../typings/enums';
import ChecklistV2Api from '../checklistV2Api';

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
    api: ChecklistV2Api;
    disabled: boolean;
    plantId: string;
    checklistId: string;
};

const CheckAllButtonV2 = ({
    checkItems,
    customCheckItems,
    setCheckItems,
    setCustomCheckItems,
    allItemsCheckedOrNA,
    setSnackbarText,
    api,
    disabled,
    plantId,
    checklistId,
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
            for (const item of itemsToCheck) {
                await api.postSetOk(plantId, checklistId, item.id);
            }
            for (const item of customItemsToCheck) {
                await api.postCustomSetOk(plantId, checklistId, item.id);
            }
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
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    const clearAll = async (): Promise<void> => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToClear = checkItems.filter(
            (item) => !item.isHeading && (item.isOk || item.isNotApplicable)
        );
        const customItemsToClear = customCheckItems.filter((item) => item.isOk);
        try {
            for (const item of itemsToClear) {
                await api.postClear(plantId, checklistId, item.id);
            }
            for (const item of customItemsToClear) {
                await api.postCustomClear(plantId, checklistId, item.id);
            }

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
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    return (
        <StyledCheckAllButton
            onClick={allItemsCheckedOrNA ? clearAll : checkAll}
            disabled={checkAllStatus === AsyncStatus.LOADING || disabled}
            variant={'outlined'}
        >
            {/* <EdsIcon
                name={allItemsCheckedOrNA ? 'checkbox' : 'checkbox_outline'}
            /> */}
            {allItemsCheckedOrNA ? 'Clear all' : 'Check all'}
        </StyledCheckAllButton>
    );
};

export default CheckAllButtonV2;
