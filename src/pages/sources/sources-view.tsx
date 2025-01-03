import { useEffect, useRef, useState } from "react";
import { Source } from "../../classes/source";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import ModifySourcesView from "./modify-source-view";
import { DropdownButtonData, GridHeaderDropdown } from "../../components/grid-header-dropdown";
import { Transaction } from "../../classes/transaction";
import { CalendarDate } from "calendar-date/dist";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

class DisplayedSource {
    path: string;
    name: string;
    amountIdx: number;
    descriptionIdx: number;
    dateIdx: number;
    lastUpdated: string;
    isDebt: boolean;
    hasHeader: boolean;

    constructor(
        path: string,
        name: string,
        amountIdx: number,
        descriptionIdx: number,
        dateIdx: number,
        lastUpdated: string,
        isDebt: boolean,
        hasHeader: boolean,
    ) {
        this.path = path;
        this.name = name;
        this.amountIdx = amountIdx;
        this.descriptionIdx = descriptionIdx;
        this.dateIdx = dateIdx;
        this.lastUpdated = lastUpdated;
        this.isDebt = isDebt;
        this.hasHeader = hasHeader;
    }
}

export function SourcesView(props: {
    sourceData: Source[],
    setSourceData: Function,
    transactionsData: Transaction[],
}) {
    const [showModifySources, setShowModifySources]: [boolean, Function] = useState(false);
    const [displayedSources, setDisplayedSources] = useState(null);
    const gridRef = useRef(null);

    function deleteSelectedSources() {
        const selectedSources: Source[] = gridRef.current.api.getSelectedRows();
        props.setSourceData(props.sourceData.filter((source: Source) =>
            !selectedSources.some((selectedSource: Source) => selectedSource.name == source.name)))
    }

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "name",
            width: 200,
        },
        {
            field: "path",
            flex: 1,
        },
        {
            headerName: "Amt Idx",
            field: "amountIdx",
            width: 74,
        },
        {
            headerName: "Date Idx",
            field: "dateIdx",
            width: 74,
        },
        {
            headerName: "Desc Idx",
            field: "descriptionIdx",
            width: 74,
        },
        {
            headerName: "Debt",
            field: "isDebt",
            width: 51,
        },
        {
            headerName: "Header",
            field: "hasHeader",
            width: 65,
        },
        {
            headerName: "Last Updated",
            field: "lastUpdated",
            width: 100,
        },
    ]);

    useEffect(() => {
        if (props.sourceData == null || props.transactionsData == null) {
            return;
        }

        setDisplayedSources(props.sourceData.map((source) => {
            let lastDate: string = props.transactionsData
                .filter((transaction) => transaction.sourceName == source.name)
                .map((transaction) => transaction.date)
                .reduce((acc, val) => dayjs(val, 'YYYY-MM-DD', true).isValid() && new CalendarDate(acc) > new CalendarDate(val) ? acc : val, '0001-01-01');
            if (lastDate == '0001-01-01') {
                lastDate = '';
            }

            return new DisplayedSource(
                source.path,
                source.name,
                source.amountIdx,
                source.descriptionIdx,
                source.dateIdx,
                lastDate,
                source.isDebt,
                source.hasHeader
            );
        }));
    }, [props.sourceData]);

    return <>
        <div className={showModifySources ? "addViewContainerActive" : "addViewContainerHidden"}>
            <ModifySourcesView
                showModifySources={showModifySources}
                setShowModifySources={setShowModifySources}
                sourceData={props.sourceData}
                setSourceData={props.setSourceData}/>
        </div>
        <div className="mainContent">
            <div className="viewContainer">
                <div className="pageTitle">
                    <h1>Sources</h1>
                    <h2>Here you can edit the configurations of each spending source.</h2>
                </div>
                <div className="gridHeader">
                    <button onClick={() => setShowModifySources(true)}>Add a source</button>
                    <GridHeaderDropdown
                        buttonData={[
                            new DropdownButtonData('Delete Selected', deleteSelectedSources, (numSelected) => numSelected == 0),
                            new DropdownButtonData('Edit Selected', () => {console.log('edit')}, () => true),
                        ]}
                        gridRef={gridRef}/>
                </div>
                <div className="ag-theme-balham-dark fullPageGrid">
                    <AgGridReact
                        rowData={displayedSources}
                        columnDefs={colDefs}
                        ref={gridRef}
                        rowSelection={{mode: 'multiRow'}}/>
                </div>
            </div>
        </div>
    </>
}