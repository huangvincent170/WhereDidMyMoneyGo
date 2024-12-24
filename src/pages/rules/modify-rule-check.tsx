import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { FaPlus, FaMinus } from "react-icons/fa";

export function ModifyRuleCheck(props: {
    ruleTests: RuleTest[],
    setRuleTests: Function,
}) {
    function FieldSelector(props: {checkField: Field, setCheckField: Function, hidden?: boolean}) {
        return <select
        className="fieldSelector"
            onChange={(e) => props.setCheckField(e.target.value)}
            defaultValue={props.checkField ?? "_select"}
            hidden={props.hidden ?? false}>
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

    function FieldOpSelector(props: {field: Field, checkOp: CheckOp, setCheckOp: Function}) {
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

    function FieldValueInput(props: {field: Field, fieldValue: number | string | Date, setFieldValue: Function}) {
        // todo field into fieldtype, change input based on fieldtype
        // todo date picker
        return <input
            className="fieldValue"
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

    function SetRuleTest(
        oldRuleTest: RuleTest,
        i: number,
        checkField?: Field,
        checkOp?: CheckOp,
        checkValue?: string | number | Date
    ) {
        const newRuleTest = new RuleTest(
            checkField ?? oldRuleTest.field,
            checkOp ?? oldRuleTest.checkOp,
            checkValue ?? oldRuleTest.value
        );
        props.setRuleTests(props.ruleTests.map((_ruleTest, _i) => i == _i ? newRuleTest : _ruleTest));
    }

    function AddRuleTest(i: number) {
        props.setRuleTests([
            ...props.ruleTests.slice(0, i+1),
            new RuleTest(undefined, undefined, undefined),
            ...props.ruleTests.slice(i+1)
        ]);
    }

    function RemoveRuleTest(i: number) {
        props.setRuleTests([
            ...props.ruleTests.slice(0, i),
            ...props.ruleTests.slice(i+1)
        ]);
    }

    return <div className="ruleCheckContainer">
        {
            props.ruleTests.map((ruleTest, i) => <div className="ruleCheck">
                <FieldSelector
                    checkField={ruleTest.field}
                    setCheckField={(checkField: Field) => SetRuleTest(ruleTest, i, checkField, undefined, undefined)}/>
                <FieldOpSelector
                    field={ruleTest.field}
                    checkOp={ruleTest.checkOp}
                    setCheckOp={(checkOp: CheckOp) => SetRuleTest(ruleTest, i, undefined, checkOp, undefined)}/>
                <FieldValueInput
                    field={ruleTest.field}
                    fieldValue={ruleTest.value}
                    setFieldValue={(fieldValue: string | number | Date) => SetRuleTest(ruleTest, i, undefined, undefined, fieldValue)}/>
                <button
                    className="iconButton"
                    onClick={() => AddRuleTest(i)}>
                    <FaPlus/>
                </button>
                <button
                    className="iconButton"
                    disabled={props.ruleTests.length <= 1}
                    onClick={() => RemoveRuleTest(i)}>
                    <FaMinus style={props.ruleTests.length <= 1 ? {color: 'grey'} : {}}/>
                </button>
            </div>
            )
        }
    </div>
}