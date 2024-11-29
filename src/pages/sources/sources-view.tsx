import { useState } from "react";
import { Source } from "../../classes/source";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import ModifySourcesView from "./modify-source-view";

export default function SourcesView(props: {sourceData: Source[], setSourceData: Function}) {
    // Column Definitions: Defines the columns to be displayed.
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

    // const testRecord: Record<string, number> = {
    //     amount: 0,
    //     date: 2
    // }

    function onClickAddSource() {
        // const newSource = new Source("test1", "test2", testRecord, false, false);
        // const newSource2 = new Source("test3", "test4", testRecord, false, false);
        
        // props.setSourceData([newSource, newSource2]);
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