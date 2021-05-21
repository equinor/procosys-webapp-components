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

const CheckItemWrapper = styled.div<{ disabled: boolean }>`
    background-color: ${(props): string =>
        props.disabled ? 'transparent' : 'transparent'};
    /* border-bottom: 2px ${COLORS.fadedBlue} solid; */
    padding: 4px 0;
    & p,
    button {
        color: ${(props): string =>
            props.disabled ? COLORS.darkGrey : 'initial'};
    }
    transition: background-color 0.2s ease-in-out;
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

const MidWrapper = styled.div`
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
    updateNA: (value: boolean, checkItemId: number) => void;
    updateOk: (value: boolean, checkItemId: number) => void;
    checklistId: number;
    isSigned: boolean;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    api: ProcosysApiService;
};

const CheckItem = ({
    item,
    isSigned,
    updateNA,
    updateOk,
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
            updateOk(false, item.id);
            updateNA(false, item.id);
            setSnackbarText('Change saved.');
            setPostNAStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSnackbarText(error.toString());
            setPostNAStatus(AsyncStatus.ERROR);
        }
    };

    const handleSetNA = async (): Promise<void> => {
        setPostNAStatus(AsyncStatus.LOADING);
        if (item.isNotApplicable) {
            clearCheckmarks();
            return;
        }
        try {
            await api.postSetNA(item.id);
            updateOk(false, item.id);
            updateNA(true, item.id);
            setSnackbarText('Change saved.');
            setPostNAStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSnackbarText(error.toString());
            setPostNAStatus(AsyncStatus.ERROR);
        }
    };

    const handleSetOk = async (): Promise<void> => {
        if (item.isOk) return clearCheckmarks();
        setPostCheckStatus(AsyncStatus.LOADING);
        try {
            await api.postSetOk(item.id);
            updateNA(false, item.id);
            updateOk(true, item.id);
            setSnackbarText('Change saved.');
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
                    <MidWrapper>
                        <p>
                            {item.sequenceNumber}. {item.text}
                        </p>
                        {item.detailText && (
                            <button
                                onClick={(): void =>
                                    setShowDescription((current) => !current)
                                }
                            >
                                <p>
                                    {showDescription
                                        ? 'Hide details'
                                        : 'Show details'}
                                </p>
                                <EdsIcon
                                    name={
                                        showDescription
                                            ? 'chevron_down'
                                            : 'chevron_right'
                                    }
                                    size={16}
                                />
                            </button>
                        )}
                    </MidWrapper>
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
