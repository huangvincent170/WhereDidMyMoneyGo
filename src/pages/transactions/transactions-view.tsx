import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { useEffect, useRef, useState } from 'react';
import { Transaction } from '../../classes/transaction';
import { CheckOp, Field, Rule, RuleTest, SetRuleOp } from '../../classes/rule';
import { DropdownButtonData, GridHeaderDropdown } from '../../components/grid-header-dropdown';

class DisplayedTransaction {
    amount: number;
    category: string;
    date: string;
    description: string;
    source: string;

    constructor(
        amount: number,
        category: string,
        date: string,
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

export function TransactionsView(props: {
    transactionData: Transaction[],
    refreshTransactionData: Function,
    rulesData: Rule[],
    setRulesData: Function,
}) {
    const [displayedTransactions, setDisplayedTransactions] = useState(null);
    const gridRef = useRef<AgGridReact<DisplayedTransaction>>();

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
            // type: 'rightAligned'
        },
    ]);

    function deleteSelectedTransactions() {
        const selectedTransactions: DisplayedTransaction[] = gridRef.current.api.getSelectedRows();
        const newDeleteRules = [];
        for (let displayedTransaction of selectedTransactions) {
            newDeleteRules.push(new Rule(
                [
                    new RuleTest(Field.Amount, CheckOp.Equals, displayedTransaction.amount),
                    new RuleTest(Field.Date, CheckOp.Equals, displayedTransaction.date),
                    new RuleTest(Field.Description, CheckOp.Equals, displayedTransaction.description),
                    new RuleTest(Field.Source, CheckOp.Equals, displayedTransaction.source)
                ],
                new SetRuleOp([[Field.Category, "DELETED"]]),
                true
            ));
        }
        props.setRulesData(props.rulesData.concat(newDeleteRules));
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

    useEffect(() => {
        props.refreshTransactionData();
    }, [props.rulesData]);

    return <div className="mainContent">
        <div className="viewContainer">
            <div className="pageTitle">
                <h1>Transactions</h1>
            </div>
            <div className="gridHeader">
                <button onClick={() => props.refreshTransactionData()}>refresh</button>
                <GridHeaderDropdown
                    buttonData={[
                        new DropdownButtonData('Delete Selected', deleteSelectedTransactions),
                        new DropdownButtonData('Edit Selected', () => {console.log('edit')}),
                        new DropdownButtonData('Split Selected', () => {console.log('split')}),
                    ]}/>
            </div>
            <div className="ag-theme-balham-dark fullPageGrid">
                <AgGridReact
                    rowData={displayedTransactions}
                    columnDefs={colDefs}
                    ref={gridRef}
                    rowSelection={{mode: 'multiRow'}}/>
            </div>
        </div>
    </div>;
}