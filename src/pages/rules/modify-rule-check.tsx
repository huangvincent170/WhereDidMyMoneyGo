import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { useState } from "react";

export function ModifyRuleCheck(props: {
    checkField: Field,
    setCheckField: Function,
    checkOp: CheckOp,
    setCheckOp: Function,
    checkValue: string | number,
    setCheckValue: Function}
) {
    // const [checkField, setCheckField] = useState(null);
    // const [checkOp, setCheckOp] = useState(null);
    // const [checkValue, setCheckValue] = useState(null);

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

    function FieldValueInput(props: {field: Field, fieldValue: number | string, setFieldValue: Function}) {
        // todo field into fieldtype, change input based on fieldtype
        // todo date picker
        return <input
            name="todo"
            defaultValue={props.fieldValue}
            onBlur={(e) => props.setFieldValue(e.target.value)}/>
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

    return <div>
        <FieldSelector
            selectedField={props.checkField}
            setSelectedField={props.setCheckField}/> 
        <FieldOpSelector
            field={props.checkField}
            checkOp={props.checkOp}
            setCheckOp={props.setCheckOp}/>
        <FieldValueInput
            field={props.checkField}
            fieldValue={props.checkValue}
            setFieldValue={props.setCheckValue}/> 
    </div>
}