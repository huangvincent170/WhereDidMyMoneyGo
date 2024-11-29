import { useState } from "react";
import { Source } from "../../classes/source";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import ModifySourcesView from "./modify-source-view";

export default function SourcesView(props: {sourceData: Source[], setSourceData: Function}) {
    // todo set actual source columns
    const [colDefs, setColDefs]: [any, any] = useState([
        { field: "name" },
        { field: "path" },
        { field: "fieldIndexMap" },
    ]);

    const [showModifySources, setShowModifySources]: [boolean, Function] = useState(false);

    interface ISourceDisplayColumns {
        path: string;
        name: string;
        amountIdx: number;
    }

    // todo make popup look nice
    function onClickAddSource() {
        setShowModifySources(true);
    }

    return <div>
        <ModifySourcesView
            showModifySources={showModifySources}
            setShowModifySources={setShowModifySources}
            sourceData={props.sourceData}
            setSourceData={props.setSourceData}
        />
        <button type="button" id="btn" onClick={onClickAddSource}>Add a source</button>
        <div
            className="ag-theme-balham-dark"
            style={{ height: 500 }}
        >
            <AgGridReact<ISourceDisplayColumns>
                rowData={props.sourceData}
                columnDefs={colDefs}
            />
        </div>
    </div>
}