import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { useEffect, useRef, useState } from 'react';
import { Transaction } from '../../classes/transaction';
import { CheckOp, Field, Rule, RuleOpType, RuleTest, SetRuleOp } from '../../classes/rule';
import { DropdownButtonData, GridHeaderDropdown } from '../../components/grid-header-dropdown';
import { ModifyTransactionsView } from './modify-transactions-view';
import { Source } from '../../classes/source';

export class DisplayedTransaction {
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

    static createDisplayedTransactions(transactions: Transaction[]): DisplayedTransaction[] {
        if (transactions == null) {
            return [];
        }

        return transactions
            .map((t) =>  new DisplayedTransaction(t.amount, t.category, t.date, t.description, t.sourceName))
            .filter((dt) => dt.category != "DELETED" && dt.category != "SPLIT");
    }

    static createMatchingRuleTests(displayedTransaction: DisplayedTransaction): RuleTest[] {
        return [
            new RuleTest(Field.Amount, CheckOp.Equals, displayedTransaction.amount),
            new RuleTest(Field.Date, CheckOp.Equals, displayedTransaction.date),
            new RuleTest(Field.Description, CheckOp.Equals, displayedTransaction.description),
            new RuleTest(Field.Source, CheckOp.Equals, displayedTransaction.source)
        ];
    }
}

export function TransactionsView(props: {
    transactionData: Transaction[],
    refreshTransactionData: Function,
    rulesData: Rule[],
    setRulesData: Function,
    categoryData: string[],
    sourceData: Source[],
}) {
    const [displayedTransactions, setDisplayedTransactions] = useState(null);
    const [showModifyTransactions, setShowModifyTransactions] = useState(null);
    const [ruleOpType, setRuleOpType] = useState(null);
    const gridRef = useRef<AgGridReact<DisplayedTransaction>>();

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "date",
            filter: 'agDateColumnFilter',
            width: 90,
        },
        {
            field: "description",
            filter: true,
            flex: 3
        },
        {
            field: "category",
            filter: true,
            flex: 1
        },
        {
            field: "source",
            filter: true,
            flex: 1
        },
        {
            field: "amount",
            filter: 'agNumberColumnFilter',
            width: 90,
        },
    ]);

    function deleteSelectedTransactions() {
        const selectedTransactions: DisplayedTransaction[] = gridRef.current.api.getSelectedRows();
        const newDeleteRules = [];
        for (let displayedTransaction of selectedTransactions) {
            newDeleteRules.push(new Rule(
                DisplayedTransaction.createMatchingRuleTests(displayedTransaction),
                new SetRuleOp([[Field.Category, "DELETED"]]),
                true,
                true,
            ));
        }
        props.setRulesData(props.rulesData.concat(newDeleteRules));
    }

    useEffect(() => {
        setDisplayedTransactions(DisplayedTransaction.createDisplayedTransactions(props.transactionData));
    }, [props.transactionData]);

    useEffect(() => {
        props.refreshTransactionData();
    }, [props.rulesData]);

    return <div>
        <div className={showModifyTransactions ? "addViewContainerActive" : "addViewContainerHidden"}>
            <ModifyTransactionsView
                showModifyTransactions={showModifyTransactions}
                setShowModifyTransactions={setShowModifyTransactions}
                ruleOpType={ruleOpType}
                gridRef={gridRef}
                categoryData={props.categoryData}
                rulesData={props.rulesData}
                setRulesData={props.setRulesData}
                sourceData={props.sourceData}/>
        </div>
        <div className="mainContent">
            <div className="viewContainer">
                <div className="pageTitle">
                    <h1>Transactions</h1>
                </div>
                <div className="gridHeader">
                    <button onClick={() => props.refreshTransactionData()}>refresh</button>
                    <GridHeaderDropdown
                        buttonData={[
                            new DropdownButtonData(
                                'Delete Selected',
                                deleteSelectedTransactions,
                                (numSelected) => numSelected == 0,
                            ),
                            new DropdownButtonData(
                                'Edit Selected',
                                () => {
                                    setRuleOpType(RuleOpType.Set);
                                    setShowModifyTransactions(true);
                                },
                                (numSelected) => numSelected == 0,
                            ),
                            new DropdownButtonData(
                                'Split Selected',
                                () => {
                                    setRuleOpType(RuleOpType.Split);
                                    setShowModifyTransactions(true);
                                },
                                (numSelected) => numSelected != 1,
                            ),
                        ]}
                        gridRef={gridRef}/>
                </div>
                <div className="ag-theme-balham-dark fullPageGrid">
                    <AgGridReact
                        rowData={displayedTransactions}
                        columnDefs={colDefs}
                        ref={gridRef}
                        rowSelection={{mode: 'multiRow'}}/>
                </div>
            </div>
        </div>
    </div>;
}