import { Button, Checkbox, Scrim } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ItemToMultiSignOrVerify } from '../../typings/apiTypes';
import { ProcosysApiService } from '../../services/procosysApi';
import { COLORS } from '../../style/GlobalStyles';
import { AsyncStatus } from '../../typings/enums';

export const MultiSignVerifyContainer = styled.div`
    border-radius: 8px;
    height: 80vh;
    width: 50vw;
    background-color: ${COLORS.white};
    padding: 16px;
    overflow: scroll;
    & img {
        width: 100%;
        max-height: 200px;
        object-fit: contain;
    }
    @media (max-width: 768px) {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        box-sizing: border-box;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    margin-top: 12px;
    & > :first-child {
        margin-right: 12px;
    }
`;

const OptionsWrapper = styled.div`
    background-color: ${COLORS.fadedBlue};
`;

type ChecklistMultiSignOrVerifyProps = {
    isMultiVerify: boolean;
    eligibleItems: ItemToMultiSignOrVerify[];
    setMultiSignOrVerifyIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tagNo: string;
    api: ProcosysApiService;
    setSnackbarText: (message: string) => void;
};

const ChecklistMultiSignOrVerify = ({
    isMultiVerify,
    eligibleItems,
    setMultiSignOrVerifyIsOpen,
    tagNo,
    api,
    setSnackbarText,
}: ChecklistMultiSignOrVerifyProps): JSX.Element => {
    const [itemsToSignOrVerify, setItemsToSignOrVerify] = useState(
        eligibleItems.map((item) => item.id)
    );
    const [allAreChecked, setAllAreChecked] = useState(true);
    const [copyTableContents, setCopyTableContents] = useState(true);
    const [postSignOrVerifyStatus, setPostSignOrVerifyStatus] = useState(
        AsyncStatus.INACTIVE
    );

    useEffect(() => {
        setAllAreChecked(itemsToSignOrVerify.length === eligibleItems.length);
    }, [itemsToSignOrVerify]);

    const handleMultiSignOrVerify = async (): Promise<void> => {
        setPostSignOrVerifyStatus(AsyncStatus.LOADING);
        try {
            if (isMultiVerify) {
                await api.postMultiVerify(itemsToSignOrVerify);
                setSnackbarText('Additional MCCRs verified.');
            } else {
                await api.postMultiSign(itemsToSignOrVerify, copyTableContents);
                setSnackbarText('Additional MCCRs signed.');
            }
            setPostSignOrVerifyStatus(AsyncStatus.SUCCESS);
            setMultiSignOrVerifyIsOpen(false);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setPostSignOrVerifyStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const determineButtonText = (): string => {
        if (isMultiVerify) {
            if (postSignOrVerifyStatus === AsyncStatus.LOADING) {
                return 'Verifying...';
            } else {
                return 'Verify selected';
            }
        } else {
            if (postSignOrVerifyStatus === AsyncStatus.LOADING) {
                return 'Signing...';
            } else {
                return 'Sign selected';
            }
        }
    };

    const handleCheckOrUncheckAll = (): void => {
        if (allAreChecked) {
            setItemsToSignOrVerify([]);
        } else {
            setItemsToSignOrVerify(eligibleItems.map((item) => item.id));
        }
    };

    const handleItemClick = (itemId: number): void => {
        if (itemsToSignOrVerify.includes(itemId)) {
            setItemsToSignOrVerify((prev) =>
                prev.filter((item) => item !== itemId)
            );
        } else {
            setItemsToSignOrVerify((prev) => [...prev, itemId]);
        }
    };

    return (
        <Scrim
            isDismissable
            onClose={(): void => setMultiSignOrVerifyIsOpen(false)}
        >
            <MultiSignVerifyContainer>
                <p>
                    MCCR {isMultiVerify ? 'verified' : 'signed'} for tag: <br />
                    <strong>{tagNo}</strong>
                </p>
                <p>
                    Do you want to {isMultiVerify ? 'verify' : 'sign'} these
                    tags, having the same form, responsible, sheet and subsheet
                    as well?
                </p>
                <OptionsWrapper>
                    <Checkbox
                        checked={allAreChecked}
                        label={allAreChecked ? 'Unselect all' : 'Select all'}
                        onChange={handleCheckOrUncheckAll}
                    />
                    {isMultiVerify ? null : (
                        <Checkbox
                            checked={copyTableContents}
                            label={'Copy table contents.'}
                            onChange={(): void =>
                                setCopyTableContents((prev) => !prev)
                            }
                        />
                    )}
                </OptionsWrapper>
                {eligibleItems.map((item) => (
                    <React.Fragment key={item.id}>
                        <br />
                        <Checkbox
                            checked={itemsToSignOrVerify.includes(item.id)}
                            label={item.tagNo}
                            onChange={(): void => handleItemClick(item.id)}
                        />
                    </React.Fragment>
                ))}
                <ButtonWrapper>
                    <Button
                        variant={'outlined'}
                        onClick={(): void => setMultiSignOrVerifyIsOpen(false)}
                    >
                        Close
                    </Button>
                    <Button
                        disabled={
                            postSignOrVerifyStatus === AsyncStatus.LOADING ||
                            itemsToSignOrVerify.length < 1
                        }
                        onClick={handleMultiSignOrVerify}
                    >
                        {determineButtonText()}
                    </Button>
                </ButtonWrapper>
            </MultiSignVerifyContainer>
        </Scrim>
    );
};

export default ChecklistMultiSignOrVerify;
