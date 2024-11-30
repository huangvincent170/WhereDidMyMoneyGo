import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { useState } from 'react';
import { Transaction } from '../../classes/transaction';

export default function TransactionsView(props: {transactionData: Transaction[]}) {

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs]: [any, any] = useState([
        { field: "date" },
        { field: "description" },
        { field: "amount" },
    ]);

    interface ITransactionDisplayColumns {
        amount: number;
        date: Date;
        description: string;
    }

    return (
        <div className="mainContent">
        <div className="sourceViewContainer">
        <div
        className="ag-theme-balham-dark"
        style={{ height: 500 }}
    >
        <AgGridReact<ITransactionDisplayColumns>
            rowData={props.transactionData}
            columnDefs={colDefs}
        />
    </div>
        </div>
        </div>
    
    )
}