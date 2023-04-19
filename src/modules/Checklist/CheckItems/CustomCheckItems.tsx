import { Button, Checkbox, Scrim, TextField } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { CustomCheckItem } from '../../../typings/apiTypes';
import { ProcosysApiService } from '../../../services/procosysApi';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';
import updateCustomCheck from '../../../utils/updateCustomCheck';
import CheckHeader from './CheckHeader';
import { AsyncStatus } from '../../../typings/enums';

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
    border-radius: 5px;
    background-color: ${COLORS.white};
    padding: 15px;
    box-shadow: ${SHADOW};
    & > :last-child {
        margin-left: 15px;
    }
`;

export type CustomCheckItemDto = {
    ItemNo: string;
    Text: string;
    IsOk: boolean;
};

type CustomCheckItemsProps = {
    customCheckItems: CustomCheckItem[];
    setCustomCheckItems: React.Dispatch<
        React.SetStateAction<CustomCheckItem[]>
    >;
    isSigned: boolean;
    setSnackbarText: (message: string) => void;
    api: ProcosysApiService;
    canEdit: boolean;
    canCheck: boolean;
};

const CustomCheckItems = ({
    customCheckItems,
    setCustomCheckItems,
    isSigned,
    setSnackbarText,
    api,
    canEdit,
    canCheck,
}: CustomCheckItemsProps): JSX.Element => {
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
    const abortController = new AbortController();

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleCreateNewItem = async () => {
        setPostCustomCheckItemStatus(AsyncStatus.LOADING);
        try {
            const nextAvailableNumber = await api.getNextCustomItemNumber(
                abortController.signal
            );
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
        return (): void => {
            abortController.abort('Custom check item component unmounted.');
        };
    };

    const handleDelete = async (customCheckItemId: number): Promise<void> => {
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

    const handleUncheck = async (item: CustomCheckItem): Promise<void> => {
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

    const handleCheckboxClick = async (
        item: CustomCheckItem
    ): Promise<void> => {
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
                        <strong style={{ fontWeight: 500 }}>
                            {item.itemNo}.
                        </strong>{' '}
                        {item.text}
                    </p>
                    <RightWrapper>
                        <Checkbox
                            disabled={
                                isSigned ||
                                postCustomCheckStatus === AsyncStatus.LOADING ||
                                !canCheck
                            }
                            enterKeyHint={'send'}
                            onChange={(): Promise<void> =>
                                handleCheckboxClick(item)
                            }
                            checked={item.isOk}
                            data-testid={'custom-checked-' + item.id}
                            label={''}
                        />
                        <Button
                            variant={'ghost_icon'}
                            disabled={
                                deleteCustomCheckStatus ===
                                    AsyncStatus.LOADING ||
                                isSigned ||
                                !canEdit
                            }
                            onClick={(): void => setItemToBeDeleted(item.id)}
                        >
                            <EdsIcon
                                color={
                                    isSigned ? COLORS.darkGrey : COLORS.danger
                                }
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
                        postCustomCheckItemStatus === AsyncStatus.LOADING ||
                        !canEdit
                    }
                    onChange={(
                        e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ): void => setCustomItemText(e.currentTarget.value)}
                    placeholder={'Enter details for new check item.'}
                />
                <Button
                    variant={'outlined'}
                    disabled={
                        isSigned ||
                        postCustomCheckItemStatus === AsyncStatus.LOADING ||
                        !canEdit
                    }
                    onClick={handleCreateNewItem}
                >
                    Add
                </Button>
            </NewCustomItemWrapper>

            {itemToBeDeleted ? (
                <Scrim
                    isDismissable
                    onClose={(): void => setItemToBeDeleted(0)}
                    open={true}
                >
                    <DeletionPopup>
                        <p>Really delete this item?</p>
                        <Button
                            variant={'outlined'}
                            onClick={(): void => setItemToBeDeleted(0)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={'danger'}
                            disabled={
                                deleteCustomCheckStatus === AsyncStatus.LOADING
                            }
                            onClick={(): Promise<void> =>
                                handleDelete(itemToBeDeleted)
                            }
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
