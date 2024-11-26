import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useCallback, useRef, useState } from 'react';
import { Transaction } from '../transaction';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';

export default function TransactionsView(props: {transactions: Transaction[]}) {

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs]: [any, any] = useState([
        { field: "date" },
        { field: "description" },
        { field: "amount" },
    ]);

    interface ITransaction {
        // sourcePath: string;
        amount: number;
        date: Date;
        description: string;
    }

    return (
    <div
        className="ag-theme-quartz"
        style={{ height: 500 }}
    >
        <AgGridReact<ITransaction>
            rowData={props.transactions}
            columnDefs={colDefs}
        />
    </div>
    )
}