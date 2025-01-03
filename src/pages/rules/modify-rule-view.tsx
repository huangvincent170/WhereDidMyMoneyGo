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
import { GridHeaderDropdown, DropdownButtonData } from "../../components/grid-header-dropdown";

export function ModifyRulesView(props: {
    categoryData: string[]
    showModifyRules: boolean,
    setShowModifyRules: Function,
    rulesData: Rule[],
    setRulesData: Function,
    sourceData: Source[],
    transactionData: Transaction[],
}) {
    function blankForm() {
        return {
            ruleTests: [new RuleTest(undefined, undefined, undefined)],
            ruleOpType: undefined as RuleOpType,
            setRuleOp: new SetRuleOp([[undefined, undefined]]),
            splitRuleOp: new SplitRuleOp([[undefined, undefined]]),
            executesOnce: false,
            locksTransaction: false,
        };
    }

    const [formData, setFormData] = useState(blankForm());
    const [displayedTransactions, setDisplayedTransactions] = useState(null);
    const [showExecutedTransactions, setShowExecutedTransactions] = useState(false);
    const gridRef = useRef(null);

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "date",
            filter: 'agDateColumnFilter',
            width: 90,
        },
        {
            field: "description",
            filter: true,
            flex: 4,
        },
        {
            field: "category",
            filter: true,
            flex: 1,
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

    function handleSubmit() {
        if (formData.ruleOpType == null) {
            console.log("null ruleoptype!");
            return;
        }

        let ruleOp: RuleOp;
        if (formData.ruleOpType == RuleOpType.Set) {
            if (formData.setRuleOp.setFieldValues == null ||
                formData.setRuleOp.setFieldValues.some(_setFieldValue => _setFieldValue[0] == null || _setFieldValue[1] == null)
            ) {
                console.log("null setRuleOp");
                return;
            }
            ruleOp = formData.setRuleOp;
        } else if (formData.ruleOpType == RuleOpType.Split) {
            ruleOp = formData.splitRuleOp;
        } else {
            throw new Error(`unknown ruleOp ${formData.ruleOpType}`)
        }

        for (let ruleTest of formData.ruleTests) {
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

        props.setRulesData(props.rulesData.concat(new Rule(
            formData.ruleTests,
            ruleOp,
            formData.executesOnce,
            formData.locksTransaction
        )));
    }

    function populateChecksFromSelected() {
        const selectedTransactions: DisplayedTransaction[] = gridRef.current.api.getSelectedRows();
        if (selectedTransactions.length != 1) {
            throw Error('expected only 1 selected transaction!');
        }
        setFormData(
            {
                ...formData,
                ruleTests: DisplayedTransaction.createMatchingRuleTests(selectedTransactions[0]),
                executesOnce: true,
                locksTransaction: true,
            }
        );
    }

    useEffect(() => {
        if (props.transactionData == null) {
            return;
        }

        const validRuleTests = formData.ruleTests.filter((ruleTest) => RuleTest.isValid(ruleTest));
        const filteredTransactions = props.transactionData.filter((transaction) => validRuleTests.every((ruleTest) => RuleTest.Test(ruleTest, transaction)));
        let executedTransactions = null;

        if (showExecutedTransactions && formData.ruleOpType != null) {
            let ruleOp: RuleOp = null;
            if (formData.ruleOpType == RuleOpType.Set) {
                const validSetFieldValues = formData.setRuleOp.setFieldValues.filter(([field, value]) => field != null && value != null && value != '');
                ruleOp = new SetRuleOp(validSetFieldValues);
            } else if (formData.ruleOpType == RuleOpType.Split) {
                const validSplitFieldValues = formData.splitRuleOp.splits.filter(([cat, value]) => cat != null && cat != '' && value != null);
                ruleOp = new SplitRuleOp(validSplitFieldValues);
            } else {
                throw Error('unexpected ruleOp');
            }

            executedTransactions = Rule.Execute([new Rule(
                validRuleTests,
                ruleOp,
                formData.executesOnce,
                formData.locksTransaction
            )], filteredTransactions);
        }

        const newDisplayedTransactions = DisplayedTransaction.createDisplayedTransactions(executedTransactions ?? filteredTransactions);
        setDisplayedTransactions(newDisplayedTransactions);
        gridRef.current.api?.setGridOption('rowData', newDisplayedTransactions);
    }, [props.transactionData, formData]);

    return <div className="addView ruleAddView" hidden={!props.showModifyRules}>
        <div className="addViewMain">
            <p className="ruleViewCheckText">If all of the following conditions match:</p>
            <ModifyRuleCheck
                categoryData={props.categoryData}
                ruleTests={formData.ruleTests}
                setRuleTests={(ruleTests: RuleTest[]) => setFormData({...formData, ruleTests: ruleTests})}
                sourceData={props.sourceData}
                heightPercent={16}/>
            <p className="ruleViewOpText">Then perform the following actions:</p>
            <ModifyRuleOp
                categoryData={props.categoryData}
                ruleOpType={formData.ruleOpType}
                setRuleOpType={(ruleOpType: RuleOpType) => setFormData({...formData, ruleOpType: ruleOpType})}
                setRuleOp={formData.setRuleOp}
                setSetRuleOp={(setRuleOp: SetRuleOp) => setFormData({...formData, setRuleOp: setRuleOp})}
                splitRuleOp={formData.splitRuleOp}
                setSplitRuleOp={(splitRuleOp: SplitRuleOp) => setFormData({...formData, splitRuleOp: splitRuleOp})}
                showRuleOpSelector={true}
                heightPercent={16}
                hiddenFields={[Field.Source]}/>
            <div className="gridHeader">
                <button onClick={() => setShowExecutedTransactions(!showExecutedTransactions)}>
                {
                    showExecutedTransactions ?
                    'Show original' :
                    'Simulate rule'
                }
                </button>
                <GridHeaderDropdown
                    buttonData={[
                        new DropdownButtonData('Populate checks from selected', populateChecksFromSelected, (numSelected: number) => numSelected != 1),
                    ]}
                    gridRef={gridRef}/>
            </div>
            <div className="ag-theme-balham-dark addRuleGrid">
                <AgGridReact
                    rowData={displayedTransactions}
                    columnDefs={colDefs}
                    ref={gridRef}
                    rowSelection={{mode: 'multiRow'}}/>
            </div>
        </div>
        <div className="addViewFooter">
            <div className="addViewFooterLeft">
                <input
                    className="inputCheckbox"
                    type="checkbox"
                    checked={formData.executesOnce}
                    onChange={() => setFormData({...formData, executesOnce: !formData.executesOnce})}/>
                <p className="tooltip">
                    ⛓️‍💥
                    <p className="tooltipText">Rule will stop execution after affecting one transaction</p>
                </p>
                <input
                    className="inputCheckbox"
                    type="checkbox"
                    checked={formData.locksTransaction}
                    onChange={() => setFormData({...formData, locksTransaction: !formData.locksTransaction})}/>
                <p className="tooltip">
                    🔒
                    <p className="tooltipText">Transactions affected by this rule cannot be affected by other rules</p>
                </p>
            </div>
            <div className="addViewFooterRight">
                <button onClick={handleSubmit}>Save Changes</button>
                <button onClick={() => props.setShowModifyRules(false)}>Close</button>
            </div>
        </div>
    </div>;
}