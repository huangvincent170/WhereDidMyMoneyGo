import { AgGridReact } from "ag-grid-react";
import { Field, Rule, RuleOpType, RuleTest, SetRuleOp, SplitRuleOp, CheckOp } from "../../classes/rule";
import { useEffect, useMemo, useRef, useState } from "react";
import { ModifyRulesView } from "./modify-rule-view";
import { DropdownButtonData, GridHeaderDropdown } from "../../components/grid-header-dropdown";

class DisplayedRule {
    testsString: string;
    actionString: string;
    ruleString: string;
    executesOnce: boolean;

    constructor(
        testsString: string,
        actionString: string,
        rule: Rule,
        executesOnce: boolean,
    ) {
        this.testsString = testsString;
        this.actionString = actionString;
        this.ruleString = JSON.stringify(rule);
        this.executesOnce = executesOnce;
    }
}

export function RulesView(props: {
    categoryData: string[],
    // transactionData: Transaction[],
    // setTransactionData: Function,
    rulesData: Rule[],
    setRulesData: Function,
}) {
    const [displayedRuleData, setDisplayedRuleData] = useState(createDisplayedRules(props.rulesData));
    const [showModifyRules, setShowModifyRules]: [boolean, Function] = useState(false);
    const gridRef = useRef(null);

    function createDisplayedRules(rules: Rule[]): DisplayedRule[] {
        if (rules == null) {
            return [];
        }

        let displayedRules: DisplayedRule[] = [];
        for (let rule of rules) {
            let testStrings: string[] = [];
            for (let test of rule.tests) {
                testStrings.push(`${test.field} ${test.checkOp} ${test.value} `);
            }

            let opStrings: string[] = [];
            if (rule.opType == RuleOpType.Set) {
                for (let [field, value] of (rule.op as SetRuleOp).setFieldValues) {
                    opStrings.push(`${rule.opType} ${field} to ${value} `);
                }
            } else if (rule.opType == RuleOpType.Split) {
                const splitString: string = (rule.op as SplitRuleOp).splits.map((split) => `${split[0]}: ${split[1]}`).join(', ');
                opStrings.push(`split into ${splitString}`)
            } else {
                throw new Error (`unexpected rule op type ${rule.opType}`);
            }

            displayedRules.push(new DisplayedRule(
                `If ${testStrings.join('and ')}`,
                `Then ${opStrings.join('and ')}`,
                rule,
                rule.executesOnce,
            ));
        }
        return displayedRules;
    }

    function deleteSelectedRules() {
        const selectedRules: DisplayedRule[] = gridRef.current.api.getSelectedRows();
        props.setRulesData(props.rulesData.filter((rule: Rule) =>
            !selectedRules.some((selectedRule: DisplayedRule) => selectedRule.ruleString == JSON.stringify(rule))));
    }

    useEffect(() => {
        setDisplayedRuleData(createDisplayedRules(props.rulesData));
    }, [props.rulesData]);

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            headerName: "Tests",
            field: "testsString",
            autoHeight: true,
            wrapText: true,
            // cellStyle: {'whiteSpace': 'pre' },
            flex: 3,
            resizable: true,
        },
        {
            headerName: "Operations",
            field: "actionString",
            autoHeight: true,
            wrapText: true,
            // cellStyle: {'whiteSpace': 'pre' },
            flex: 1
        },
        {
            headerName: "Executes Once",
            field: "executesOnce",
            width: 111,
            resizable: false,
        },
    ]);

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
                    <GridHeaderDropdown
                        buttonData={[
                            new DropdownButtonData('Delete Selected', deleteSelectedRules),
                            new DropdownButtonData('Edit Selected', () => {console.log('edit')}),
                        ]}/>
                </div>
                <div className="ag-theme-balham-dark fullPageGrid">
                    <AgGridReact
                        animateRows={false}
                        rowData={displayedRuleData}
                        columnDefs={colDefs}
                        ref={gridRef}
                        rowSelection={{mode: 'multiRow'}}/>
                </div>
            </div>
        </div>
    </div>;
}