import { AgGridReact } from "ag-grid-react";
import { Category } from "../../classes/category";
import { Field, Rule, RuleOpType, RuleTest, SetRuleOp, SplitRuleOp, CheckOp } from "../../classes/rule";
import { useEffect, useMemo, useState } from "react";
import { ModifyRulesView } from "./modify-rule-view";
import { FaRegPlusSquare } from "react-icons/fa";

export function RulesView(props: {
    categoryData: Category[],
    // transactionData: Transaction[],
    // setTransactionData: Function,
    rulesData: Rule[],
    setRulesData: Function,
}) {

    // const testRuleData = [
    //     new Rule(
    //         [
    //             new RuleTest(Field.Description, CheckOp.Contains, "Chipotle"),
    //             new RuleTest(Field.Amount, CheckOp.Equals, 12)
    //         ],
    //         new SetRuleOp(Field.Category, "Food")
    //     ),
    //     new Rule(
    //         [
    //             new RuleTest(Field.Source, CheckOp.Equals, "Bilt"),
    //             new RuleTest(Field.Amount, CheckOp.Equals, 2.8)
    //         ],
    //         new SplitRuleOp([["Food", 7], ["Gifts", 4]])
    //     ),
    // ];


    class DisplayedRule {
        testsString: string;
        actionString: string;

        constructor(
            testsString: string,
            actionString: string,
        ) {
            this.testsString = testsString;
            this.actionString = actionString;
        }
    }


    function createDisplayedRules(rules: Rule[]): DisplayedRule[] {
        if (rules == null) {
            return [];
        }

        let displayedRules: DisplayedRule[] = [];
        for (let rule of rules) {
            let testStrings: string[] = [];
            for (let test of rule.tests) {
                testStrings.push(`${test.field} ${test.checkOp} ${test.value}\n`);
            }

            let opStrings: string[] = [];
            if (rule.opType == RuleOpType.Set) {
                for (let [field, value] of (rule.op as SetRuleOp).setFieldValues) {
                    opStrings.push(`${rule.opType} ${field} to ${value}\n`);
                }
            } else if (rule.opType == RuleOpType.Split) {

            } else {
                throw new Error (`unexpected rule op type ${rule.opType}`);
            }

            displayedRules.push(new DisplayedRule(
                `If ${testStrings.join('and ')}`,
                `Then ${opStrings.join('and ')}`
            ));
        }
        return displayedRules;
    }

    const [displayedRuleData, setDisplayedRuleData] = useState(createDisplayedRules(props.rulesData));
    const [showModifyRules, setShowModifyRules]: [boolean, Function] = useState(false);

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            headerName: "Tests",
            field: "testsString",
            autoHeight: true,
            wrapText: true,
            cellStyle: {'whiteSpace': 'pre' },
        },
        {
            headerName: "Operations",
            field: "actionString",
            autoHeight: true,
            wrapText: true,
            cellStyle: {'whiteSpace': 'pre' },
        },
    ]);



    useEffect(() => {
        setDisplayedRuleData(createDisplayedRules(props.rulesData));
    }, [props.rulesData]);


    return <div>
        <div className={showModifyRules ? "addViewContainerActive" : "addViewContainerHidden"}>
            <ModifyRulesView
                showModifyRules={showModifyRules}
                setShowModifyRules={setShowModifyRules}
                rulesData={props.rulesData}
                setRulesData={props.setRulesData}
            />
        </div>
        <div className="mainContent">
            <div className="viewContainer">
                <div className="pageTitle">
                    <h1>Rules</h1>
                    <h2>Here you can view and edit rules.</h2>
                </div>
                <div className="gridHeader">
                    <button onClick={() => setShowModifyRules(true)}>New Rule</button>
                </div>
                <div className="ag-theme-balham-dark">
                    <AgGridReact
                        rowData={displayedRuleData}
                        columnDefs={colDefs}/>
                </div>
            </div>
        </div>
    </div>;
}