import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ModifyRuleCheck } from "./modify-rule-check";

export function ModifyRulesView(props: {
    showModifyRules: boolean,
    setShowModifyRules: Function,
    rulesData: Rule[],
    setRulesData: Function
}) {
    

    const [checkField, setCheckField] = useState(null);
    const [checkOp, setCheckOp] = useState(null);
    const [checkValue, setCheckValue] = useState(null);
    const [ruleOpType, setRuleOpType] = useState(null);
    const [setField, setSetField] = useState(null);
    const [setValue, setSetValue] = useState(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        event.preventDefault();

        let ruleOp: RuleOp;
        if (ruleOpType == RuleOpType.Set) {
            ruleOp = new SetRuleOp(setField, setValue);
        } else if (ruleOpType == RuleOpType.Split) {
            ruleOp = new SplitRuleOp([]);
        } else {
            throw new Error(`unknown ruleOp ${ruleOpType}`)
        }

        const newRule = new Rule(
            [
                new RuleTest(checkField, checkOp, checkValue)
            ],
            ruleOp
        );

        props.setRulesData(props.rulesData.concat(newRule));
    }

    function FieldSelector(props: {selectedField: Field, setSelectedField: Function, hidden?: boolean}) {
        return <select
            name="field"
            onChange={(e) => props.setSelectedField(e.target.value)}
            defaultValue={props.selectedField ?? "_select"}
            hidden={props.hidden ?? false}>
            <option hidden disabled key="_select" value="_select">
                -- select field --
            </option>
            {
                Object.values(Field).map((field) => 
                    <option
                        key={field}
                        value={field}>
                        {field}
                    </option>
                )
            }
        </select>;
    }

    function FieldOpSelector(props: {field: Field, checkOp: CheckOp, setCheckOp: Function}) {
        const validOps: CheckOp[] = props.field != null ? ValidFieldTypeValidOps[FieldToFieldType[props.field]] : Object.values(CheckOp);
        return <select
            name="op"
            defaultValue={props.checkOp ?? "_select"}
            onChange={(e) => props.setCheckOp(e.target.value)}>
            <option hidden disabled key="_select" value="_select">
                -- select check --
            </option>
            {
                validOps.map((validOp) => 
                    <option
                        key={validOp}
                        value={validOp}>
                        {validOp}
                    </option>
                )
            }
        </select>;
    }

    function FieldValueInput(props: {fieldType: FieldType, fieldValue: number | string, setFieldValue: Function}) {
        // todo date picker
        return <input
            name="todo"
            defaultValue={props.fieldValue}
            onBlur={(e) => props.setFieldValue(e.target.value)}
            />
        // if (props.fieldType == FieldType.Date) {
        //     return <input
        //     name="todo"
        //     />
        // } else {
        //     return <input
        //     name="todo"
        //     />
        // }
    }

    function RuleOpSelector(props: {ruleOpType: RuleOpType, setRuleOpType: Function}) {
        return <select
            name="rule-op"
            defaultValue={ruleOpType ?? "_select"}
            onChange={(e) => {console.log("ruleopchanged"); props.setRuleOpType(e.target.value)}}>
            <option hidden disabled key="_select" value="_select">
                -- select operation --
            </option>
            {
                Object.values(RuleOpType).map((ruleOpType) => 
                    <option
                        key={ruleOpType}
                        value={ruleOpType}>
                        {ruleOpType}
                    </option>
                )
            }
        </select>;
    }

    // todo window modal for path
    // todo make popup look nice
    return (<div className="addView" hidden={!props.showModifyRules}>
        <form className="addRuleForm" method="post" onSubmit={handleSubmit}>
            If all of the following conditions match:<br/>
            <ModifyRuleCheck
                checkField={checkField}
                setCheckField={setCheckField}
                checkOp={checkOp}
                setCheckOp={setCheckOp}
                checkValue={checkValue}
                setCheckValue={setCheckValue}/>
            <br/>
            Then perform the following actions:<br/>
            <RuleOpSelector
                ruleOpType={ruleOpType}
                setRuleOpType={setRuleOpType} /> 
            <FieldSelector
                selectedField={setField}
                setSelectedField={setSetField}
                hidden={ruleOpType == RuleOpType.Split}/> 
            <FieldValueInput
                fieldType={setField}
                fieldValue={setValue}
                setFieldValue={setSetValue}/> 
            <br />
            <button type="submit">Save Changes</button>
        </form>
        <button onClick={() => props.setShowModifyRules(false)}>Close</button>
    </div>);
}