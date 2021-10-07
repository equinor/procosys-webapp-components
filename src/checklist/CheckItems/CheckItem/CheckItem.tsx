import React, { useState } from 'react';
import styled from 'styled-components';
import {
    AsyncStatus,
    CheckItem as CheckItemType,
} from '../../../services/apiTypes';
import { Checkbox } from '@equinor/eds-core-react';
import MetaTable from './MetaTable/MetaTable';
import EdsIcon from '../../../components/icons/EdsIcon';
import { COLORS } from '../../../style/GlobalStyles';
import { ProcosysApiService } from '../../../services/procosysApi';
import updateCheck from '../../../utils/updateCheck';
import updateNA from '../../../utils/updateNA';
import ShowMoreButton from '../../../components/buttons/ShowMoreButton';

const CheckItemWrapper = styled.div<{ disabled: boolean }>`
    background-color: transparent;
    margin-top: 8px;
    & p,
    button {
        color: ${(props): string =>
            props.disabled ? COLORS.darkGrey : '#3D3D3D'};
    }
    transition: color 0.2s ease-in-out;
`;

const DescriptionAndCheckWrapper = styled.div`
    display: flex;
    align-items: center;
    & > p {
        margin: 0;
        margin-right: 12px;
    }
`;

const DescriptionWrapper = styled.div`
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
    & > p {
        flex: auto;
        margin: 0;
    }
`;

const CheckItemDescriptionWrapper = styled.div`
    & > p {
        margin: 8px 0px 8px 0px;
        padding-left: 24px;
        border-left: 2px solid ${COLORS.fadedBlue};
    }
`;

const CheckboxGroup = styled.div`
    flex: 0 0 80px;
    display: flex;
    justify-content: space-between;
    margin-left: auto;
`;

type CheckItemProps = {
    item: CheckItemType;
    setCheckItems: React.Dispatch<React.SetStateAction<CheckItemType[]>>;
    isSigned: boolean;
    setSnackbarText: (message: string) => void;
    api: ProcosysApiService;
};

const CheckItem = ({
    item,
    isSigned,
    setCheckItems,
    setSnackbarText,
    api,
}: CheckItemProps): JSX.Element => {
    const [postCheckStatus, setPostCheckStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [postNAStatus, setPostNAStatus] = useState(AsyncStatus.INACTIVE);
    const [showDescription, setShowDescription] = useState(false);

    const clearCheckmarks = async (): Promise<void> => {
        try {
            await api.postClear(item.id);
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
            setPostNAStatus(AsyncStatus.SUCCESS);
            setPostCheckStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSnackbarText(error.toString());
            setPostNAStatus(AsyncStatus.ERROR);
            setPostCheckStatus(AsyncStatus.ERROR);
        }
    };

    const handleSetNA = async (): Promise<void> => {
        setPostNAStatus(AsyncStatus.LOADING);
        if (item.isNotApplicable) return clearCheckmarks();
        try {
            await api.postSetNA(item.id);
            updateCheck({
                value: false,
                checkItemId: item.id,
                setItems: setCheckItems,
            });
            updateNA({
                value: true,
                checkItemId: item.id,
                setItems: setCheckItems,
            });
            setPostNAStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSnackbarText(error.message.toString());
            setPostNAStatus(AsyncStatus.ERROR);
        }
    };

    const handleSetOk = async (): Promise<void> => {
        setPostCheckStatus(AsyncStatus.LOADING);
        if (item.isOk) return clearCheckmarks();
        try {
            await api.postSetOk(item.id);
            updateNA({
                value: false,
                checkItemId: item.id,
                setItems: setCheckItems,
            });
            updateCheck({
                value: true,
                checkItemId: item.id,
                setItems: setCheckItems,
            });
            setPostCheckStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSnackbarText(error.toString());
            setPostCheckStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <>
            <CheckItemWrapper disabled={item.isNotApplicable}>
                <DescriptionAndCheckWrapper>
                    <DescriptionWrapper>
                        <p>
                            <span style={{ fontWeight: 500 }}>
                                {item.sequenceNumber}
                            </span>
                            . {item.text}
                        </p>
                        {item.detailText && (
                            <ShowMoreButton
                                handleOnClick={(): void =>
                                    setShowDescription((current) => !current)
                                }
                                showCondition={showDescription}
                                showText={'Show details'}
                                hideText={'Hide details'}
                            />
                        )}
                    </DescriptionWrapper>
                    <CheckboxGroup>
                        <Checkbox
                            disabled={
                                isSigned ||
                                item.isNotApplicable ||
                                postCheckStatus === AsyncStatus.LOADING
                            }
                            enterKeyHint={'send'}
                            onChange={handleSetOk}
                            checked={item.isOk}
                            data-testid={'checked-' + item.id}
                            label={''}
                        />
                        <Checkbox
                            disabled={
                                isSigned || postNAStatus === AsyncStatus.LOADING
                            }
                            enterKeyHint={'send'}
                            onChange={handleSetNA}
                            checked={item.isNotApplicable}
                            label={''}
                            data-testid={'NA-' + item.id}
                        />
                    </CheckboxGroup>
                </DescriptionAndCheckWrapper>
                <CheckItemDescriptionWrapper>
                    {showDescription && <p>{item.detailText}</p>}
                </CheckItemDescriptionWrapper>
                {item.metaTable && !item.isNotApplicable && (
                    <MetaTable
                        disabled={item.isNotApplicable || isSigned}
                        labels={item.metaTable.columnLabels}
                        rows={item.metaTable.rows}
                        isSigned={isSigned}
                        checkItemId={item.id}
                        api={api}
                    />
                )}
            </CheckItemWrapper>
        </>
    );
};

export default CheckItem;
