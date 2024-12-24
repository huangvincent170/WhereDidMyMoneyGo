import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ModifyRuleCheck } from "./modify-rule-check";
import { ModifyRuleOp } from "./modify-rule-op"


export function ModifyRulesView(props: {
    showModifyRules: boolean,
    setShowModifyRules: Function,
    rulesData: Rule[],
    setRulesData: Function
}) {
    
    const [ruleTests, setRuleTests] = useState([new RuleTest(undefined, undefined, undefined)]);
    const [ruleOpType, setRuleOpType] = useState(null);
    const [setRuleOp, setSetRuleOp] = useState(new SetRuleOp([[undefined, undefined]]));
    const [splitRuleOp, setSplitRuleOp] = useState(null);

    function handleSubmit() {
        // Prevent the browser from reloading the page
        // event.preventDefault();

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

        props.setRulesData(props.rulesData.concat(new Rule(ruleTests, ruleOp)));
    }

    return <div className="addView" hidden={!props.showModifyRules}>
        If all of the following conditions match:
        <br/>
        <ModifyRuleCheck
            ruleTests={ruleTests}
            setRuleTests={setRuleTests}/>
        <br/>
        Then perform the following actions:
        <br/>
            <ModifyRuleOp
                ruleOpType={ruleOpType}
                setRuleOpType={setRuleOpType}
                setRuleOp={setRuleOp}
                setSetRuleOp={setSetRuleOp}
                splitRuleOp={splitRuleOp}
                setSplitRuleOp={setSplitRuleOp}/>
        <br />
        <button onClick={handleSubmit}>Save Changes</button>
        <button onClick={() => props.setShowModifyRules(false)}>Close</button>
    </div>;
}