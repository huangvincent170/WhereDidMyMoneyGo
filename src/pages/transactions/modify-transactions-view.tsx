import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ModifyRuleCheck } from "../rules/modify-rule-check";
import { ModifyRuleOp } from "../rules/modify-rule-op"
import { Source } from "../../classes/source";
import { DisplayedTransaction } from "./transactions-view";

export function ModifyTransactionsView(props: {
    showModifyTransactions: boolean,
    setShowModifyTransactions: Function,
    ruleOpType: RuleOpType,
    gridRef: any,
    categoryData: string[],
    rulesData: Rule[],
    setRulesData: Function,
    sourceData: Source[],
}) {
    // const [ruleTests, setRuleTests] = useState(null);
    const [setRuleOp, setSetRuleOp] = useState(new SetRuleOp([[undefined, undefined]]));
    const [splitRuleOp, setSplitRuleOp] = useState(new SplitRuleOp([[undefined, undefined]]));

    function handleSubmit() {
        // // Prevent the browser from reloading the page
        // // event.preventDefault();
        if (props.gridRef == null || props.rulesData == null) {
            return;
        }

        const selectedDisplayedTransactions: DisplayedTransaction[] = props.gridRef.current.api?.getSelectedRows();

        if (selectedDisplayedTransactions.length == 0) {
            return;
        }

        const newRules: Rule[] = [];
        for (let displayedTransaction of selectedDisplayedTransactions) {
            newRules.push(new Rule(
                [
                    new RuleTest(Field.Amount, CheckOp.Equals, displayedTransaction.amount),
                    new RuleTest(Field.Date, CheckOp.Equals, displayedTransaction.date),
                    new RuleTest(Field.Description, CheckOp.Equals, displayedTransaction.description),
                    new RuleTest(Field.Source, CheckOp.Equals, displayedTransaction.source)
                ],
                props.ruleOpType == RuleOpType.Set ? setRuleOp : splitRuleOp,
                true,
                true
            ));
        }

        props.setRulesData(props.rulesData.concat(newRules));
        props.setShowModifyTransactions(false);
        setSetRuleOp(new SetRuleOp([[undefined, undefined]]));
        setSplitRuleOp(new SplitRuleOp([[undefined, undefined]]));
    }

    return <div className="addView transactionAddView" hidden={!props.showModifyTransactions}>
        <div className="addViewMain ">
            <span hidden={props.ruleOpType == RuleOpType.Set}>Split the selected transaction into the following categories and amounts:</span>
            <span hidden={props.ruleOpType == RuleOpType.Split}>Edit the selected transactions to have the following properties:</span>
            <ModifyRuleOp
                categoryData={props.categoryData}
                ruleOpType={props.ruleOpType}
                setRuleOpType={null}
                setRuleOp={setRuleOp}
                setSetRuleOp={setSetRuleOp}
                splitRuleOp={splitRuleOp}
                setSplitRuleOp={setSplitRuleOp}
                showRuleOpSelector={false}
                heightPercent={90}/>
        </div>
        <div className="addViewFooter">
            <div className="addViewFooterLeft">
                <input
                    className="inputCheckbox"
                    type="checkbox"
                    checked={true}
                    disabled={true}/>
                <span style={{color: 'grey'}}>Rule executes once</span>
            </div>
            <div className="addViewFooterRight">
                <button onClick={handleSubmit}>Save Changes</button>
                <button onClick={() => props.setShowModifyTransactions(false)}>Close</button>
            </div>
        </div>
    </div>;
}