import { Rule, Field, CheckOp, RuleOpType, RuleOp, FieldType, SetRuleOp, SplitRuleOp, RuleTest } from "../../classes/rule";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FieldSelector, FieldValueInput, RuleOpTypeSelector } from "./modify-rule-form-fields";

export function ModifyRuleOp(props: {
    categoryData: string[],
    ruleOpType: RuleOpType,
    setRuleOpType: Function,
    setRuleOp: SetRuleOp,
    setSetRuleOp: Function,
    splitRuleOp: SplitRuleOp,
    setSplitRuleOp: Function,
    showRuleOpSelector: boolean,
    heightPercent: number,
    hiddenFields?: Field[],
}) {
    function SetSetRuleOp(i: number, setField?: Field, setValue?: string | number) {
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

    function SetSplitRuleOp(i: number, category?: string, amount?: number) {
        props.setSplitRuleOp(new SplitRuleOp(props.splitRuleOp.splits.map((_split, _i) =>
            _i == i ? [category ?? _split[0], amount ?? _split[1]] : _split)));
    }

    function AddSplitRuleOp(i: number) {
        props.setSplitRuleOp(new SplitRuleOp([
            ...props.splitRuleOp.splits.slice(0, i+1),
            [undefined, undefined],
            ...props.splitRuleOp.splits.slice(i+1)
        ]));
    }

    function RemoveSplitRuleOp(i: number) {
        props.setSplitRuleOp(new SplitRuleOp([
            ...props.splitRuleOp.splits.slice(0, i),
            ...props.splitRuleOp.splits.slice(i+1)
        ]));
    }

    return <div className="ruleOpContainer"
        style={{height: `${props.heightPercent}%`}}>
        <div className={`ruleOpTypeSelectorContainer ${props.showRuleOpSelector ? '' : 'hidden'}`}>
            <RuleOpTypeSelector
                ruleOpType={props.ruleOpType}
                setRuleOpType={props.setRuleOpType}/>
        </div>
        <div className={
            `setRuleOpContainer
            ${props.ruleOpType != null && props.ruleOpType != RuleOpType.Set ? 'hidden' : ''}
            ${props.showRuleOpSelector ? 'ruleOpContainerSelectorShown' : 'ruleOpContainerSelectorHidden'}`
            }>
        {
            props.setRuleOp.setFieldValues.map((_setFieldValue, i) =>
                <div className="ruleOp" key={i}>
                    <FieldSelector
                        field={_setFieldValue[0]}
                        setField={(setField: Field) => SetSetRuleOp(i, setField, undefined)}
                        hiddenFields={props.hiddenFields}/>
                    <FieldValueInput
                        categories={props.categoryData}
                        className="setRuleFieldValue"
                        field={_setFieldValue[0]}
                        fieldValue={_setFieldValue[1]}
                        setFieldValue={(value: string | number) => SetSetRuleOp(i, undefined, value)}/>
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
        <div className="splitRuleOpContainer" style={(props.ruleOpType != RuleOpType.Split) ? {display:'none'} : {}}>
        {
            props.splitRuleOp.splits.map((_split, i) =>
                <div className="ruleOp" key={i}>
                    <FieldValueInput
                        categories={props.categoryData}
                        className="splitRuleCategoryFieldValue"
                        field={Field.Category}
                        fieldValue={_split[0]}
                        setFieldValue={(categoryId: string) => SetSplitRuleOp(i, categoryId, undefined)}/>
                    <FieldValueInput
                        className="splitRuleAmountFieldValue"
                        field={Field.Amount}
                        fieldValue={_split[1]}
                        setFieldValue={(amount: number) => SetSplitRuleOp(i, undefined, amount)}/>
                    <button
                        className="iconButton"
                        disabled={props.ruleOpType == null}
                        onClick={() => AddSplitRuleOp(i)}>
                        <FaPlus style={props.ruleOpType == null ? {color: 'grey'} : {}}/>
                    </button>
                    <button
                        className="iconButton"
                        disabled={props.ruleOpType == null || props.setRuleOp.setFieldValues.length <= 1}
                        onClick={() => RemoveSplitRuleOp(i)}>
                        <FaMinus style={props.ruleOpType == null || props.setRuleOp.setFieldValues.length <= 1 ? {color: 'grey'} : {}}/>
                    </button>
                </div>
            )
        }
        </div>
    </div>
}