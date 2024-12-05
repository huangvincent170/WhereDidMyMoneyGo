import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { useState } from 'react';
import { Transaction } from '../../classes/transaction';

export function TransactionsView(props: {
    transactionData: Transaction[],
    refreshTransactionData: Function
}) {

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "date",
            filter: 'agDateColumnFilter',
        },
        {
            field: "description",
            filter: true,
        },
        {
            field: "category",
            filter: true,
        },
        {
            field: "amount",
            filter: 'agNumberColumnFilter',
        },
    ]);

    //TODO
    interface ITransactionDisplayColumns {
        date: Date;
        description: string;
        category: string;
        amount: number;
    }

    return <div className="mainContent">
        <div className="transactionsViewContainer">
            <div>
                <div className="pageTitle"><b>Transactions</b></div>
            </div>
            <div>
                <button onClick={() => props.refreshTransactionData()}>refresh</button>
            </div>
            <div className="ag-theme-balham-dark" style={{ height: 500 }}>
                <AgGridReact<ITransactionDisplayColumns>
                    rowData={props.transactionData}
                    columnDefs={colDefs}
                />
            </div>
        </div>
    </div>;
}