import { useState } from "react";
import { Source } from "../class/source";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";

export default function SourcesView(props: {sources: Source[], setSourceData: Function}) {
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs]: [any, any] = useState([
        { field: "name" },
        { field: "path" },
        { field: "fieldIndexMap" },
    ]);

    interface ISourceDisplayColumns {
        path: string;
        name: string;
        fieldIndexMap: Record<string, number>;
    }

    const testRecord: Record<string, number> = {
        amount: 0,
        date: 2
    }
    function onClickAddSource() {
        const newSource = new Source("test1", "test2", testRecord, false);
        const newSource2 = new Source("test3", "test4", testRecord, false);
        
        props.setSourceData([newSource, newSource2]);
    }

    return <div>
        <button type="button" id="btn" onClick={onClickAddSource}>Add a source</button>
        <div
            className="ag-theme-balham-dark"
            style={{ height: 500 }}
        >
            <AgGridReact<ISourceDisplayColumns>
                rowData={props.sources}
                columnDefs={colDefs}
            />
        </div>
    </div>
}