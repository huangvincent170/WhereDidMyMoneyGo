import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { useState } from 'react';
import { Transaction } from '../../classes/transaction';

export function TransactionsView(props: {
    transactionData: Transaction[],
    refreshTransactionData: Function
}) {
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

    interface ITransactionDisplayColumns {
        date: Date;
        description: string;
        category: string;
        amount: number;
    }

    return <div className="mainContent">
        <div className="viewContainer">
            <div className="pageTitle">
                <h1>Transactions</h1>
            </div>
            <div className="gridHeader">
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