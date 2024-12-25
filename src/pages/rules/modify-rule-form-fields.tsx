import { Category } from "../../classes/category";
import { Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";

export function FieldSelector(props: {field: Field, setField: Function}) {
    return <select
        className="fieldSelector"
        onChange={(e) => props.setField(e.target.value)}
        defaultValue={props.field ?? "_select"}>
        <option hidden disabled key="_select" value="_select">select field</option>
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

export function FieldOpSelector(props: {field: Field, checkOp: CheckOp, setCheckOp: Function}) {
    const validOps: CheckOp[] = props.field != null ? ValidFieldTypeValidOps[FieldToFieldType[props.field]] : Object.values(CheckOp);
    return <select
        className="fieldOpSelector"
        defaultValue={props.checkOp ?? "_select"}
        onChange={(e) => props.setCheckOp(e.target.value)}>
        <option hidden disabled key="_select" value="_select">select check</option>
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

export function FieldValueInput(props: {
    categories?: Category[],
    field: Field,
    fieldValue: number | string | Date,
    setFieldValue: Function,
    className?: string,
}) {
    // todo field into fieldtype, change input based on fieldtype
    // todo date picker
    if (props.field == Field.Category) {
        return <select
            className={props.className}
            defaultValue={props.fieldValue as string ?? "_select"}
            onChange={(e) => props.setFieldValue(e.target.value)}>
            <option hidden disabled key="_select" value="_select">select category</option>
            {
                props.categories != null ?
                props.categories.map((category: Category) => 
                    <option
                        key={category.id}
                        value={category.id}>
                        {category.id}
                    </option>
                )
                :
                <></>
            }
        </select>;
    } else {
        return <input
            className={props.className}
            defaultValue={(props.fieldValue) as number | string}
            onBlur={(e) => props.setFieldValue(e.target.value)}/>
    }
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

export function RuleOpTypeSelector(props: {ruleOpType: RuleOpType, setRuleOpType: Function}) {
    return <select
        className="ruleOpTypeSelector"
        onChange={(e) => props.setRuleOpType(e.target.value)}
        defaultValue={props.ruleOpType ?? "_select"}>
        <option hidden disabled key="_select" value="_select">select op</option>
        {
            Object.values(RuleOpType).map((field) => 
                <option
                    key={field}
                    value={field}>
                    {field}
                </option>
            )
        }
    </select>;
}