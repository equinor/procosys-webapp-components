import React, { useState } from 'react';
import { AsyncStatus, CheckItem } from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../../components/icons/EdsIcon';
import styled from 'styled-components';
import { ProcosysApiService } from '../../services/procosysApi';

const StyledCheckAllButton = styled(Button)`
    :disabled {
        margin: 24px 0 24px auto;
    }
    margin: 24px 0 24px auto;
`;

type CheckAllButtonProps = {
    items: CheckItem[];
    updateOk: (value: boolean, checkItemId: number) => void;
    allItemsCheckedOrNA: boolean;
    setSnackbarText: (message: string) => void;
    api: ProcosysApiService;
};

const CheckAllButton = ({
    items,
    updateOk,
    allItemsCheckedOrNA,
    setSnackbarText,
    api,
}: CheckAllButtonProps): JSX.Element => {
    const [checkAllStatus, setCheckAllStatus] = useState(AsyncStatus.INACTIVE);
    const checkAll = async (): Promise<void> => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToCheck = items.filter(
            (item) => !item.isOk && !item.isNotApplicable
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return api.postSetOk(item.id);
                })
            );
            itemsToCheck.forEach((item) => updateOk(true, item.id));
            setCheckAllStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Changes saved.');
        } catch (error) {
            setCheckAllStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save changes.');
        }
    };

    const uncheckAll = async (): Promise<void> => {
        setCheckAllStatus(AsyncStatus.LOADING);
        const itemsToCheck = items.filter(
            (item) => item.isOk && !item.isNotApplicable
        );
        try {
            await Promise.all(
                itemsToCheck.map((item) => {
                    return api.postClear(item.id);
                })
            );
            itemsToCheck.forEach((item) => updateOk(false, item.id));
            setCheckAllStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Uncheck complete.');
        } catch (error) {
            setCheckAllStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save changes.');
        }
    };

    return (
        <StyledCheckAllButton
            onClick={allItemsCheckedOrNA ? uncheckAll : checkAll}
            disabled={checkAllStatus === AsyncStatus.LOADING}
        >
            {/* <EdsIcon
                name={allItemsCheckedOrNA ? 'checkbox' : 'checkbox_outline'}
            /> */}
            {allItemsCheckedOrNA ? 'Clear all' : 'Check all'}
        </StyledCheckAllButton>
    );
};

export default CheckAllButton;
