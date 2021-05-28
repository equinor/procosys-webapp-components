import { Button, Checkbox, Scrim, TextField } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { AsyncStatus, CustomCheckItem } from '../../services/apiTypes';
import { ProcosysApiService } from '../../services/procosysApi';
import { COLORS } from '../../style/GlobalStyles';
import updateCustomCheck from '../../utils/updateCustomCheck';
import CheckHeader from './CheckHeader';

const CustomCheckItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    & p {
        margin: 0;
    }
`;

const NewCustomItemWrapper = styled.div`
    display: flex;
    margin-bottom: 16px;
    margin-top: 16px;
    & > button,
    button:disabled {
        margin-left: 24px;
        margin-right: 12px;
    }
`;

const RightWrapper = styled.div`
    display: flex;
    align-items: center;
    & button {
        margin-right: 5px;
        margin-left: 1px;
    }
`;

const DeletionPopup = styled.div`
    border-radius: 20px;
    background-color: ${COLORS.white};
    padding: 15px;
    & > :last-child {
        margin-left: 15px;
    }
`;

type CustomCheckItemsProps = {
    customCheckItems: CustomCheckItem[];
    setCustomCheckItems: React.Dispatch<
        React.SetStateAction<CustomCheckItem[]>
    >;
    isSigned: boolean;
    setSnackbarText: (message: string) => void;
    api: ProcosysApiService;
};

export type CustomCheckItemDto = {
    ItemNo: string;
    Text: string;
    IsOk: boolean;
};

const CustomCheckItems = ({
    customCheckItems,
    setCustomCheckItems,
    isSigned,
    setSnackbarText,
    api,
}: CustomCheckItemsProps) => {
    const [postCustomCheckStatus, setPostCustomCheckStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [deleteCustomCheckStatus, setDeleteCustomCheckStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [postCustomCheckItemStatus, setPostCustomCheckItemStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [itemToBeDeleted, setItemToBeDeleted] = useState(0);
    const [customItemText, setCustomItemText] = useState('');

    const handleCreateNewItem = async () => {
        setPostCustomCheckItemStatus(AsyncStatus.LOADING);
        try {
            const nextAvailableNumber = await api.getNextCustomItemNumber();
            const newIdFromApi = await api.postCustomCheckItem({
                ItemNo: nextAvailableNumber,
                IsOk: false,
                Text: customItemText,
            });
            setPostCustomCheckItemStatus(AsyncStatus.SUCCESS);
            setCustomCheckItems((existingItems) => [
                ...existingItems,
                {
                    id: newIdFromApi,
                    itemNo: nextAvailableNumber,
                    isOk: false,
                    text: customItemText,
                },
            ]);
            setCustomItemText('');
        } catch {
            setPostCustomCheckItemStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to save new check item.');
        }
    };

    const handleDelete = async (customCheckItemId: number) => {
        setDeleteCustomCheckStatus(AsyncStatus.LOADING);
        try {
            await api.deleteCustomCheckItem(customCheckItemId);
            setCustomCheckItems((existingItems) =>
                existingItems.filter(
                    (existingItem) => existingItem.id !== customCheckItemId
                )
            );
            setItemToBeDeleted(0);
            setDeleteCustomCheckStatus(AsyncStatus.SUCCESS);
        } catch {
            setSnackbarText('Unable to delete item.');
            setDeleteCustomCheckStatus(AsyncStatus.ERROR);
        }
    };

    const handleUncheck = async (item: CustomCheckItem) => {
        try {
            await api.postCustomClear(item.id);
            updateCustomCheck({
                value: false,
                checkItemId: item.id,
                setItems: setCustomCheckItems,
            });
            setPostCustomCheckStatus(AsyncStatus.SUCCESS);
        } catch {
            setPostCustomCheckStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to uncheck item.');
        }
    };

    const handleCheckboxClick = async (item: CustomCheckItem) => {
        setPostCustomCheckStatus(AsyncStatus.LOADING);
        if (item.isOk) {
            handleUncheck(item);
            return;
        }
        try {
            await api.postCustomSetOk(item.id);
            updateCustomCheck({
                value: true,
                checkItemId: item.id,
                setItems: setCustomCheckItems,
            });
            setPostCustomCheckStatus(AsyncStatus.SUCCESS);
        } catch {
            setPostCustomCheckStatus(AsyncStatus.ERROR);
            setSnackbarText('Unable to check item.');
        }
    };
    return (
        <>
            <CheckHeader text={'Custom check items'} />
            {customCheckItems.map((item) => (
                <CustomCheckItemWrapper key={item.id}>
                    <p>
                        {item.itemNo}. {item.text}
                    </p>
                    <RightWrapper>
                        <Checkbox
                            disabled={
                                isSigned ||
                                postCustomCheckStatus === AsyncStatus.LOADING
                            }
                            enterKeyHint={'send'}
                            onChange={() => handleCheckboxClick(item)}
                            checked={item.isOk}
                            data-testid={'custom-checked-' + item.id}
                            label={''}
                        />
                        <Button
                            variant={'ghost_icon'}
                            disabled={
                                deleteCustomCheckStatus ===
                                    AsyncStatus.LOADING || isSigned
                            }
                            onClick={() => setItemToBeDeleted(item.id)}
                        >
                            <EdsIcon
                                color={COLORS.danger}
                                name={'delete_to_trash'}
                            />
                        </Button>
                    </RightWrapper>
                </CustomCheckItemWrapper>
            ))}

            <NewCustomItemWrapper>
                <TextField
                    id={'new-custom-item'}
                    value={customItemText}
                    disabled={
                        isSigned ||
                        postCustomCheckItemStatus === AsyncStatus.LOADING
                    }
                    onChange={(
                        e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ) => setCustomItemText(e.currentTarget.value)}
                    placeholder={'Enter details for new check item.'}
                />
                <Button
                    variant={'outlined'}
                    disabled={
                        isSigned ||
                        postCustomCheckItemStatus === AsyncStatus.LOADING
                    }
                    onClick={handleCreateNewItem}
                >
                    Add
                </Button>
            </NewCustomItemWrapper>

            {itemToBeDeleted ? (
                <Scrim isDismissable onClose={() => setItemToBeDeleted(0)}>
                    <DeletionPopup>
                        <p>Really delete this item?</p>
                        <Button
                            variant={'outlined'}
                            onClick={() => setItemToBeDeleted(0)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={'danger'}
                            disabled={
                                deleteCustomCheckStatus === AsyncStatus.LOADING
                            }
                            onClick={() => handleDelete(itemToBeDeleted)}
                        >
                            Delete
                        </Button>
                    </DeletionPopup>
                </Scrim>
            ) : null}
        </>
    );
};

export default CustomCheckItems;
