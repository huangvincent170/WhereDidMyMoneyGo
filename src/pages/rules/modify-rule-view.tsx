import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ModifyRuleCheck } from "./modify-rule-check";
import { ModifyRuleOp } from "./modify-rule-op"
import { Source } from "../../classes/source";
import { Transaction } from "../../classes/transaction";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-balham.css";
import { DisplayedTransaction } from "../transactions/transactions-view";

export function ModifyRulesView(props: {
    categoryData: string[]
    showModifyRules: boolean,
    setShowModifyRules: Function,
    rulesData: Rule[],
    setRulesData: Function,
    sourceData: Source[],
    transactionData: Transaction[],
}) {
    const [ruleTests, setRuleTests] = useState([new RuleTest(undefined, undefined, undefined)]);
    const [ruleOpType, setRuleOpType] = useState(null);
    const [setRuleOp, setSetRuleOp] = useState(new SetRuleOp([[undefined, undefined]]));
    const [splitRuleOp, setSplitRuleOp] = useState(new SplitRuleOp([[undefined, undefined]]));
    const [executesOnce, setExecutesOnce] = useState(false);
    const [displayedTransactions, setDisplayedTransactions] = useState(null);
    const [showExecutedTransactions, setShowExecutedTransactions] = useState(false);
    const gridRef = useRef(null);

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "date",
            filter: 'agDateColumnFilter',
            width: 100,
        },
        {
            field: "description",
            filter: true,
            flex: 5
        },
        {
            field: "category",
            filter: true,
            minWidth: 1,
        },
        {
            field: "amount",
            filter: 'agNumberColumnFilter',
            width: 90,
        },
    ]);

    function handleSubmit() {
        if (ruleOpType == null) {
            console.log("null ruleoptype!");
            return;
        }

        let ruleOp: RuleOp;
        if (ruleOpType == RuleOpType.Set) {
            if (setRuleOp.setFieldValues == null || setRuleOp.setFieldValues.some(_setFieldValue => _setFieldValue[0] == null || _setFieldValue[1] == null)) {
                console.log("null setRuleOp");
                return;
            }
            ruleOp = setRuleOp;
        } else if (ruleOpType == RuleOpType.Split) {
            ruleOp = splitRuleOp;
        } else {
            throw new Error(`unknown ruleOp ${ruleOpType}`)
        }

        for (let ruleTest of ruleTests) {
            if (ruleTest.checkOp == null) {
                console.log("null checkop!");
                return;
            } else if (ruleTest.field == null) {
                console.log("null field!");
                return;
            } else if (ruleTest.value == null || ruleTest.value == "") {
                console.log("null value!");
                return;
            }
        }

        props.setRulesData(props.rulesData.concat(new Rule(ruleTests, ruleOp, executesOnce)));
    }

    useEffect(() => {
        if (props.transactionData == null) {
            return;
        }

        const validRuleTests = ruleTests.filter((ruleTest) => RuleTest.isValid(ruleTest));
        const filteredTransactions = props.transactionData.filter((transaction) => validRuleTests.every((ruleTest) => RuleTest.Test(ruleTest, transaction)));
        let executedTransactions = null;

        if (showExecutedTransactions && ruleOpType != null) {
            if (ruleOpType == RuleOpType.Set) {
                const validSetFieldValues = setRuleOp.setFieldValues.filter(([field, value]) => field != null && value != null && value != '');
                executedTransactions = Rule.Execute([new Rule(validRuleTests, new SetRuleOp(validSetFieldValues), executesOnce)], filteredTransactions);
            } else if (ruleOpType == RuleOpType.Split) {
                const validSplitFieldValues = splitRuleOp.splits.filter(([cat, value]) => cat != null && cat != '' && value != null);
                executedTransactions = Rule.Execute([new Rule(validRuleTests, new SplitRuleOp(validSplitFieldValues), executesOnce)], filteredTransactions);
            }
        }

        const newDisplayedTransactions = DisplayedTransaction.createDisplayedTransactions(executedTransactions ?? filteredTransactions);
        setDisplayedTransactions(newDisplayedTransactions);
        gridRef.current.api?.setGridOption('rowData', newDisplayedTransactions);
    }, [props.transactionData, ruleTests, ruleOpType, setRuleOp, splitRuleOp, showExecutedTransactions, executesOnce]);

    return <div className="addView ruleAddView" hidden={!props.showModifyRules}>
        <div className="addViewMain">
            <p className="ruleViewCheckText">If all of the following conditions match:</p>
            <ModifyRuleCheck
                categoryData={props.categoryData}
                ruleTests={ruleTests}
                setRuleTests={setRuleTests}
                sourceData={props.sourceData}
                heightPercent={16}/>
            <p className="ruleViewOpText">Then perform the following actions:</p>
            <ModifyRuleOp
                categoryData={props.categoryData}
                ruleOpType={ruleOpType}
                setRuleOpType={setRuleOpType}
                setRuleOp={setRuleOp}
                setSetRuleOp={setSetRuleOp}
                splitRuleOp={splitRuleOp}
                setSplitRuleOp={setSplitRuleOp}
                showRuleOpSelector={true}
                heightPercent={16}
                hiddenFields={[Field.Source]}/>
            <div className="addRuleGridHeader">
                <p>
                    {
                        showExecutedTransactions ?
                        'Transactions after rule effects' :
                        'Transactions affected by this rule'
                    }
                </p>
                <button onClick={() => setShowExecutedTransactions(!showExecutedTransactions)}>
                {
                    showExecutedTransactions ?
                    'Show original' :
                    'Simulate rule'
                }
                </button>
            </div>
            <div className="ag-theme-balham-dark addRuleGrid">
                <AgGridReact
                    rowData={displayedTransactions}
                    columnDefs={colDefs}
                    ref={gridRef}/>
            </div>
        </div>
        <div className="addViewFooter">
            <div className="addViewFooterLeft">
                <input
                    className="inputCheckbox"
                    type="checkbox"
                    checked={executesOnce}
                    onChange={() => setExecutesOnce(!executesOnce)}/>
                Rule executes once
            </div>
            <div className="addViewFooterRight">
                <button onClick={handleSubmit}>Save Changes</button>
                <button onClick={() => props.setShowModifyRules(false)}>Close</button>
            </div>
        </div>
    </div>;
}