import { useState } from "react";
import { Source } from "../../classes/source";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import ModifySourcesView from "./modify-source-view";

export function SourcesView(props: {sourceData: Source[], setSourceData: Function}) {
    function actionCellRenderer() {
        // todo make look nice
        return <div className="gridButtonContainer">
            <button data-action="edit" className="gridButton"> edit  </button>
            <button data-action="delete" className="gridButton"> delete </button>
        </div>;
    }

    function onCellClicked(params: any) {
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            let action = params.event.target.dataset.action;

            // todo make edit button work

            if (action === "delete") {
                params.api.applyTransaction({
                    remove: [params.node.data]
                });
                const newSourceData = props.sourceData.filter(source => source.name != params.node.data.name);
                props.setSourceData(newSourceData);
            }
        }
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
        },
        {
            headerName: "",
            width: 110,
            cellRenderer: actionCellRenderer,
            resizable: false,
            colId: "action",
            type: 'rightAligned',
        }
    ]);

    const [showModifySources, setShowModifySources]: [boolean, Function] = useState(false);

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
                </div>
                <div className="ag-theme-balham-dark fullPageGrid">
                    <AgGridReact
                        rowData={props.sourceData}
                        columnDefs={colDefs}
                        onCellClicked={onCellClicked}/>
                </div>
            </div>
        </div>
    </>
}