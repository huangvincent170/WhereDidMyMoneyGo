import { useRef, useState } from "react";
import { Source } from "../../classes/source";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import ModifySourcesView from "./modify-source-view";
import { DropdownButtonData, GridHeaderDropdown } from "../../components/grid-header-dropdown";

export function SourcesView(props: {sourceData: Source[], setSourceData: Function}) {
    const [showModifySources, setShowModifySources]: [boolean, Function] = useState(false);
    const gridRef = useRef(null);

    function deleteSelectedSources() {
        const selectedSources: Source[] = gridRef.current.api.getSelectedRows();
        props.setSourceData(props.sourceData.filter((source: Source) =>
            !selectedSources.some((selectedSource: Source) => selectedSource.name == source.name)))
    }

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            headerName: "Name",
            field: "name",
            width: 200,
        },
        {
            headerName: "Path",
            field: "path",
            flex: 1,
        },
        {
            headerName: "Amount Idx",
            field: "amountIdx",
            width: 100,
        },
        {
            headerName: "Descrpt Idx",
            field: "descriptionIdx",
            width: 100,
        },
        {
            headerName: "Date Idx",
            field: "dateIdx",
            width: 100,
        },
        {
            headerName: "Is Debt",
            field: "isDebt",
            width: 100,
        },
        {
            headerName: "Has Header",
            field: "hasHeader",
            width: 100,
        }
    ]);

    return <>
        <div className={showModifySources ? "addViewContainerActive" : "addViewContainerHidden"}>
            <ModifySourcesView
                showModifySources={showModifySources}
                setShowModifySources={setShowModifySources}
                sourceData={props.sourceData}
                setSourceData={props.setSourceData}
            />
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
                            new DropdownButtonData('Delete Selected', deleteSelectedSources),
                            new DropdownButtonData('Edit Selected', () => {console.log('edit')}),
                        ]}/>
                </div>
                <div className="ag-theme-balham-dark fullPageGrid">
                    <AgGridReact
                        rowData={props.sourceData}
                        columnDefs={colDefs}
                        ref={gridRef}
                        rowSelection={{mode: 'multiRow'}}/>
                </div>
            </div>
        </div>
    </>
}