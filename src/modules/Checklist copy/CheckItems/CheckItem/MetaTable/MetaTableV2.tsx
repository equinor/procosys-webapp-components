import React, { useEffect, useRef, useState } from 'react';
import { ColumnLabel, Row } from '../../../../../typings/apiTypes';
import styled from 'styled-components';
import MetaTableCell from './MetaTableCellV2';
import EdsIcon from '../../../../../components/icons/EdsIcon';
import { COLORS } from '../../../../../style/GlobalStyles';
import { ProcosysApiService } from '../../../../../services/procosysApi';
import ChecklistV2Api from '../../../checklistV2Api';

const MetaTableWrapper = styled.table`
    border-spacing: 4px;
    margin-left: auto;
    & > p {
        margin: 0;
        padding-bottom: 12px;
    }
    & thead {
        & label {
            margin: 0;
            text-align: center;
        }
    }
    & tbody {
        vertical-align: bottom;
        & th {
            min-width: 100px;
            padding-right: 10px;
            & > label {
                margin: 0;
                padding-bottom: 22px;
                float: right;
            }
        }
        & tr {
            & td {
                padding: 0;
                margin: 0;
            }
        }
    }
`;

const HorizontalScroll = styled.div`
    overflow-x: scroll;
    padding: 6px 10px 0px 24px;
    border-left: 2px solid ${COLORS.fadedBlue};
    margin-top: 6px;
    & > div {
        & > p {
            margin: 0 4px 0 0;
        }
        background-color: ${COLORS.fadedBlue};
        padding: 4px 4px 4px 8px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        width: fit-content;
    }
`;

type MetaTableProps = {
    labels: ColumnLabel[];
    rows: Row[];
    isSigned: boolean;
    checkItemId: number;
    disabled: boolean;
    api: ChecklistV2Api;
    plantId: string;
    checklistId: string;
};

const MetaTable = ({
    labels,
    rows,
    disabled,
    checkItemId,
    api,
    plantId,
    checklistId,
}: MetaTableProps): JSX.Element => {
    const [tableIsScrollable, setTableIsScrollable] = useState(false);
    const tableContainerRef = useRef<HTMLDivElement>(
        document.createElement('div')
    );
    const headers = labels.map((label) => (
        <React.Fragment key={label.id}>
            {label && (
                <th>
                    <label>{label.label}</label>
                </th>
            )}
        </React.Fragment>
    ));
    const rowsToDisplay = rows.map((row) => {
        const cells = row.cells.map((cell) => {
            const key = cell.columnId.toString() + row.id.toString();
            // For tables with only one column, show the label on top of the cells..
            const label = row.cells.length < 2 ? row.label : '';
            return (
                <MetaTableCell
                    key={key + 'text'}
                    disabled={disabled}
                    checkItemId={checkItemId}
                    rowId={row.id}
                    cell={cell}
                    label={label}
                    api={api}
                    plantId={plantId}
                    checklistId={checklistId}
                />
            );
        });

        // For tables with more than one column, insert label to the left of each rows.
        return (
            <tr key={row.id}>
                <th>
                    <label>{row.cells.length > 1 && row.label}</label>
                </th>
                {cells}
            </tr>
        );
    });

    useEffect(() => {
        setTableIsScrollable(
            tableContainerRef.current.scrollWidth >
                tableContainerRef.current.clientWidth
        );
    }, [tableContainerRef]);

    return (
        <HorizontalScroll ref={tableContainerRef}>
            <MetaTableWrapper>
                {headers.length > 1 && (
                    <thead>
                        <tr>
                            <th />
                            {headers}
                        </tr>
                    </thead>
                )}

                <tbody>{rowsToDisplay}</tbody>
            </MetaTableWrapper>
            {tableIsScrollable && (
                <div>
                    <p>
                        <i>Long table. Swipe right</i>
                    </p>
                    <EdsIcon name="arrow_drop_right" color="primary" />
                </div>
            )}
        </HorizontalScroll>
    );
};

export default MetaTable;
