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
    class DisplayedRule {
        testsString: string;
        actionString: string;
        ruleString: string;

        constructor(
            testsString: string,
            actionString: string,
            rule: Rule,
        ) {
            this.testsString = testsString;
            this.actionString = actionString;
            this.ruleString = JSON.stringify(rule);
        }
    }

    function createDisplayedRules(rules: Rule[]): DisplayedRule[] {
        if (rules == null) {
            return [];
        }

        console.log("rules");
        console.log(props.rulesData);

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
                `Then ${opStrings.join('and ')}`,
                rule
            ));
        }
        return displayedRules;
    }

    const [displayedRuleData, setDisplayedRuleData] = useState(createDisplayedRules(props.rulesData));
    const [showModifyRules, setShowModifyRules]: [boolean, Function] = useState(false);

    function onCellClicked(params: any) {
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            let action = params.event.target.dataset.action;

            // todo make edit button work

            if (action === "delete") {
                params.api.applyTransaction({
                    remove: [params.node.data]
                });
                props.setRulesData(props.rulesData.filter(rule => JSON.stringify(rule) != params.node.data.ruleString));
            }
        }
    }

    function ActionCellRenderer() {
        // todo make look nice
        return <div>
            {/* <button data-action="edit"> Add subcategory </button> */}
            <button data-action="delete"> delete </button>
        </div>;
    }

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
        {
            headerName: "",
            cellRenderer: ActionCellRenderer,
            colId: "action"
        }
    ]);

    useEffect(() => {
        setDisplayedRuleData(createDisplayedRules(props.rulesData));
    }, [props.rulesData]);


    return <div>
        <div className={showModifyRules ? "addViewContainerActive" : "addViewContainerHidden"}>
            <ModifyRulesView
                categoryData={props.categoryData}
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
                        columnDefs={colDefs}
                        onCellClicked={onCellClicked}/>
                </div>
            </div>
        </div>
    </div>;
}