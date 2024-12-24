import { Rule, Field, CheckOp, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { FaPlus, FaMinus } from "react-icons/fa";

export function ModifyRuleOp(props: {
    ruleOpType: RuleOpType,
    setRuleOpType: Function,
    setRuleOp: SetRuleOp,
    setSetRuleOp: Function,
    splitRuleOp: SplitRuleOp,
    setSplitRuleOp: Function
}) {
    function RuleOpTypeSelector(props: {ruleOpType: RuleOpType, setRuleOpType: Function}) {
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

    function FieldSelector(props: {setField: Field, setSetField: Function}) {
        return <select
        className="fieldSelector"
            onChange={(e) => props.setSetField(e.target.value)}
            defaultValue={props.setField ?? "_select"}>
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

    function FieldValueInput(props: {field: Field, fieldValue: number | string | Date, setFieldValue: Function}) {
        // todo field into fieldtype, change input based on fieldtype
        // todo date picker
        return <input
            className="setRuleFieldValue"
            defaultValue={(props.fieldValue) as number | string}
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

    function SetSetRuleOp(i: number, setField?: Field, setValue?: string | number | Date) {
        props.setSetRuleOp(new SetRuleOp(props.setRuleOp.setFieldValues.map((_setFieldValue, _i) =>
            _i == i ? [setField ?? _setFieldValue[0], setValue ?? _setFieldValue[1]] : _setFieldValue)));
    } 

    function AddSetRuleOp(i: number) {
        props.setSetRuleOp(new SetRuleOp([
            ...props.setRuleOp.setFieldValues.slice(0, i+1),
            [undefined, undefined],
            ...props.setRuleOp.setFieldValues.slice(i+1)
        ]));
    }

    function RemoveSetRuleOp(i: number) {
        props.setSetRuleOp(new SetRuleOp([
            ...props.setRuleOp.setFieldValues.slice(0, i),
            ...props.setRuleOp.setFieldValues.slice(i+1)
        ]));
    }

    return <div className="ruleOpContainer">
        <RuleOpTypeSelector
            ruleOpType={props.ruleOpType}
            setRuleOpType={props.setRuleOpType}/>
        <div className="setRuleOpContainer" style={(props.ruleOpType != null && props.ruleOpType != RuleOpType.Set) ? {display:'none'} : {}}>
        {
            props.setRuleOp.setFieldValues.map((_setFieldValue, i) =>
                <div className="ruleOp" key={i}>
                    <FieldSelector
                        setField={_setFieldValue[0]}
                        setSetField={(setField: Field) => SetSetRuleOp(i, setField, undefined)}/>
                    <FieldValueInput
                        field={_setFieldValue[0]}
                        fieldValue={_setFieldValue[1]}
                        setFieldValue={(value: string | number | Date) => SetSetRuleOp(i, undefined, value)}/>
                    <button
                        className="iconButton"
                        disabled={props.ruleOpType == null}
                        onClick={() => AddSetRuleOp(i)}>
                        <FaPlus style={props.ruleOpType == null ? {color: 'grey'} : {}}/>
                    </button>
                    <button
                        className="iconButton"
                        disabled={props.ruleOpType == null || props.setRuleOp.setFieldValues.length <= 1}
                        onClick={() => RemoveSetRuleOp(i)}>
                        <FaMinus style={props.ruleOpType == null || props.setRuleOp.setFieldValues.length <= 1 ? {color: 'grey'} : {}}/>
                    </button>
                </div>
            )
        }
        </div>
        <div hidden={props.ruleOpType != RuleOpType.Split}>
        </div>
    </div>
}