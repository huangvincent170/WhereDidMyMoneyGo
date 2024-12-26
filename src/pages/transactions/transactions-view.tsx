import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { useEffect, useState } from 'react';
import { Transaction } from '../../classes/transaction';
import { CheckOp, Field, Rule, RuleTest, SetRuleOp } from '../../classes/rule';

export function TransactionsView(props: {
    transactionData: Transaction[],
    refreshTransactionData: Function,
    rulesData: Rule[],
    setRulesData: Function,
}) {
    class DisplayedTransaction {
        amount: number;
        category: string;
        date: Date;
        description: string;
        source: string;

        constructor(
            amount: number,
            category: string,
            date: Date,
            description: string,
            source: string
        ) {
            this.amount = Number(amount);
            this.category = category;
            this.date = date;
            this.description = description;
            this.source = source;
        }
    }

    function ActionCellRenderer() {
        // todo make look nice
        return <div>
            {/* <button data-action="edit"> Add subcategory </button> */}
            <button data-action="delete"> delete </button>
        </div>;
    }

    const [displayedTransactions, setDisplayedTransactions] = useState(null);

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "date",
            filter: 'agDateColumnFilter',
            width: 100,
        },
        {
            field: "description",
            filter: true,
            flex: 1
        },
        {
            field: "category",
            filter: true,
            minWidth: 320,
        },
        {
            field: "amount",
            filter: 'agNumberColumnFilter',
            width: 90,
        },
        {
            headerName: "",
            cellRenderer: ActionCellRenderer,
            colId: "action",
            width: 100,
            resizable: false,
            type: 'rightAligned'
        },
    ]);

    function onCellClicked(params: any) {
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            let action = params.event.target.dataset.action;

            // todo make edit button work

            if (action === "delete") {
                params.api.applyTransaction({
                    remove: [params.node.data]
                });
                props.setRulesData(props.rulesData.concat(new Rule(
                    [
                        new RuleTest(Field.Amount, CheckOp.Equals, params.node.data.amount),
                        // new RuleTest(Field.Category, CheckOp.Equals, params.node.data.category),
                        // new RuleTest(Field.Date, CheckOp.Equals, params.node.data.date),
                        new RuleTest(Field.Description, CheckOp.Equals, params.node.data.description),
                        new RuleTest(Field.Source, CheckOp.Equals, params.node.data.source)
                        // todo include source
                    ],
                    new SetRuleOp([[Field.Category, "DELETED"]]),
                    true
                )));
            }
        }
    }

    function createDisplayedTransactions(transactions: Transaction[]): DisplayedTransaction[] {
        if (transactions == null) {
            return [];
        }

        return props.transactionData
            .map((t) =>  new DisplayedTransaction(t.amount, t.category, t.date, t.description, t.sourceName))
            .filter((dt) => dt.category != "DELETED" && dt.category != "SPLIT")
    }

    useEffect(() => {
        setDisplayedTransactions(createDisplayedTransactions(props.transactionData));
    }, [props.transactionData]);

    return <div className="mainContent">
        <div className="viewContainer">
            <div className="pageTitle">
                <h1>Transactions</h1>
            </div>
            <div className="gridHeader">
                <button onClick={() => props.refreshTransactionData()}>refresh</button>
            </div>
            <div className="ag-theme-balham-dark fullPageGrid">
                <AgGridReact
                    rowData={displayedTransactions}
                    columnDefs={colDefs}
                    onCellClicked={onCellClicked}/>
            </div>
        </div>
    </div>;
}