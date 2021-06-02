import { Button, Checkbox } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus, ItemToMultiSignOrVerify } from '../services/apiTypes';
import { ProcosysApiService } from '../services/procosysApi';
import { COLORS } from '../style/GlobalStyles';

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    bottom: 66px;
    left: 0;
    width: 100vw;
    background-color: ${COLORS.white};
    z-index: 100;
    padding: 24px;
    overflow: auto;
    box-sizing: border-box;
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
}: ChecklistMultiSignOrVerifyProps) => {
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

    const handleMultiSignOrVerify = async () => {
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
            setPostSignOrVerifyStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const determineButtonText = () => {
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

    const handleCheckOrUncheckAll = () => {
        if (allAreChecked) {
            setItemsToSignOrVerify([]);
        } else {
            setItemsToSignOrVerify(eligibleItems.map((item) => item.id));
        }
    };

    const handleItemClick = (itemId: number) => {
        if (itemsToSignOrVerify.includes(itemId)) {
            setItemsToSignOrVerify((prev) =>
                prev.filter((item) => item !== itemId)
            );
        } else {
            setItemsToSignOrVerify((prev) => [...prev, itemId]);
        }
    };

    return (
        <Wrapper>
            <p>
                MCCR {isMultiVerify ? 'verified' : 'signed'} for tag: <br />
                <strong>{tagNo}</strong>
            </p>
            <p>
                Do you want to {isMultiVerify ? 'verify' : 'sign'} these tags,
                having the same form, responsible, sheet and subsheet as well?
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
                        onChange={() => setCopyTableContents((prev) => !prev)}
                    />
                )}
            </OptionsWrapper>
            {eligibleItems.map((item) => (
                <React.Fragment key={item.id}>
                    <br />
                    <Checkbox
                        checked={itemsToSignOrVerify.includes(item.id)}
                        label={item.tagNo}
                        onChange={() => handleItemClick(item.id)}
                    />
                </React.Fragment>
            ))}
            <ButtonWrapper>
                <Button
                    variant={'outlined'}
                    onClick={() => setMultiSignOrVerifyIsOpen(false)}
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
        </Wrapper>
    );
};

export default ChecklistMultiSignOrVerify;
