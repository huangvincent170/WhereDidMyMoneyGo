import { Rule, Field, CheckOp, FieldToFieldType, ValidFieldTypeValidOps, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FieldOpSelector, FieldSelector, FieldValueInput } from "./modify-rule-form-fields";
import { Source } from "../../classes/source";

export function ModifyRuleCheck(props: {
    ruleTests: RuleTest[],
    setRuleTests: Function,
    categoryData: string[],
    sourceData: Source[],
}) {
    function SetRuleTest(
        oldRuleTest: RuleTest,
        i: number,
        checkField?: Field,
        checkOp?: CheckOp,
        checkValue?: string | number
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
            props.ruleTests.map((ruleTest, i) => <div className="ruleCheck" key={i}>
                <FieldSelector
                    field={ruleTest.field}
                    setField={(checkField: Field) => SetRuleTest(ruleTest, i, checkField, undefined, undefined)}/>
                <FieldOpSelector
                    field={ruleTest.field}
                    checkOp={ruleTest.checkOp}
                    setCheckOp={(checkOp: CheckOp) => SetRuleTest(ruleTest, i, undefined, checkOp, undefined)}/>
                <FieldValueInput
                    categories={props.categoryData}
                    className="checkFieldValue"
                    field={ruleTest.field}
                    fieldValue={ruleTest.value}
                    setFieldValue={(fieldValue: string | number) => SetRuleTest(ruleTest, i, undefined, undefined, fieldValue)}
                    sourceData={props.sourceData}/>
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