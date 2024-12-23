import { AgGridReact } from "ag-grid-react";
import { Category } from "../../classes/category";
import { Field, Rule, RuleOpType, RuleTest, SetRuleOp, SplitRuleOp, CheckOp } from "../../classes/rule";
import { useEffect, useMemo, useState } from "react";
import ModifyRulesView from "./modify-rule-view";

export function RulesView(props: {
    categoryData: Category[],
    // transactionData: Transaction[],
    // setTransactionData: Function,
    rulesData: Rule[],
    setRulesData: Function,
}) {

    const testRuleData = [
        new Rule(
            [
                new RuleTest(Field.Description, CheckOp.Contains, "Chipotle"),
                new RuleTest(Field.Amount, CheckOp.Equals, 12)
            ],
            new SetRuleOp(Field.Category, "Food")
        ),
        new Rule(
            [
                new RuleTest(Field.Source, CheckOp.Equals, "Bilt"),
                new RuleTest(Field.Amount, CheckOp.Equals, 2.8)
            ],
            new SplitRuleOp([["Food", 7], ["Gifts", 4]])
        ),
    ];

    // class DisplayedRule {
    //     qualifier: string;
    //     field: Field | string;
    //     op: RuleOpType | CheckOp;
    //     value: string | number | Date | [string, number][];
    //     rowSpan: number;
    //     index: number;

    //     constructor(
    //         qualifier: string,
    //         field: Field | string,
    //         op: RuleOpType | CheckOp,
    //         value: string | number | Date | [string, number][],
    //         rowSpan: number,
    //         index: number
    //     ) {
    //         this.qualifier = qualifier;
    //         this.field = field;
    //         this.op = op;
    //         this.value = value;
    //         this.rowSpan = rowSpan;
    //         this.index = index;
    //     }
    // }

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

    // function createDisplayedRules(rules: Rule[]): DisplayedRule[] {
    //     let displayedRules: DisplayedRule[] = [];
    //     let idx = 1;
    //     for (let rule of rules) {
    //         for (let i = 0; i < rule.tests.length; i++) {
    //             displayedRules.push(new DisplayedRule(
    //                 i == 0 ? "If" : "and",
    //                 rule.tests[i].field,
    //                 rule.tests[i].valueOp,
    //                 rule.tests[i].value,
    //                 i == 0 ? rule.tests.length + 1 : 1,
    //                 idx
    //             ));
    //         }

    //         let opType: RuleOpType = null;
    //         if (rule.op instanceof SetRuleOp) {
    //             opType = RuleOpType.Set;
    //         } else if (rule.op instanceof SplitRuleOp) {
    //             opType = RuleOpType.Split
    //         } else {
    //             throw new Error(`Unexpected rule op type ${rule.op}`)
    //         }
            
    //         displayedRules.push(new DisplayedRule(
    //             "then",
    //             rule.op.setField,
    //             opType,
    //             rule.op.setValue,
    //             1,
    //             idx
    //         ));

    //         idx += 1;
    //     }
    //     return displayedRules;
    // }

    function createDisplayedRules(rules: Rule[]): DisplayedRule[] {
        if (rules == null) {
            return [];
        }

        let displayedRules: DisplayedRule[] = [];
        for (let rule of rules) {
            let testsString = "";
            console.log(rule);
            for (let i = 0; i < rule.tests.length; i++) {
                testsString += `${i == 0 ? "If" : "and"} ${rule.tests[i].field} ${rule.tests[i].checkOp} ${rule.tests[i].value}\n`;
            }

            displayedRules.push(new DisplayedRule(
                testsString,
                `then ${rule.opType} ${rule.op.setField} ${rule.op.setValue}`
            ));
        }
        return displayedRules;
    }

    // function rowSpan(params: RowSpanParams) {
    //     // console.log(params.data);
    //     // console.log(params.data.tests.length + 1);
    //     return params.data.rowSpan;
    //     // return 2;
    // }

    // function qualifierCellRenderer(params: CustomCellRendererProps) {
    //     // if (params.data.tests.length == 0) {
    //     //     return;
    //     // }
    //     return (
    //         <div>
    //             <div className="show-name">If</div>
    //             <div className="show-name">And</div>
    //             <div className="presenter-name">Then</div>
    //         </div>
    //     );
    // };
    // const [colDefs, setColDefs] = useState([
    //     {
    //         headerName: "a",
    //         field: "qualifier",
    //         rowSpan: rowSpan,
    //         cellRenderer: qualifierCellRenderer,
    //         cellDataType: false,
    //         cellClassRules: {
    //             "show-cell": "value!===undefined",
    //         },
    //     },
    //     { field: "Field" },
    //     // { field: "Operation" },
    //     // { field: "Value" }
    // ]);
    const [displayedRuleData, setDisplayedRuleData] = useState(createDisplayedRules(props.rulesData));
    const [showModifyRules, setShowModifyRules]: [boolean, Function] = useState(false);

    // const [colDefs, setColDefs] = useState([
    //     {
    //         field: "qualifier",
    //         rowSpan: rowSpan,
    //     },
    //     {
    //         field: "field",
    //         rowSpan: rowSpan,
    //     },
    //     {
    //         field: "op",
    //         rowSpan: rowSpan,
    //     },
    //     {
    //         field: "value",
    //         rowSpan: rowSpan,
    //     }
    // ]);

    // function cellRenderer(params: CustomCellRendererProps) {
    //     return params.data.testStrings
    // }

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "testsString",
            autoHeight: true,
            wrapText: true,
            cellStyle: {'whiteSpace': 'pre' }
        },
        {
            field: "actionString"
        },
    ]);

    // const defaultColDef = useMemo<ColDef>(() => {
    //     return {
    //       width: 170,
    //       sortable: false,
    //     };
    //   }, []);

    useEffect(() => {
        setDisplayedRuleData(createDisplayedRules(props.rulesData));
        // setDisplayedRuleData(createDisplayedRules(testRuleData));
    }, [props.rulesData]);

    // const getRowClass = (params: any) => {
    //     console.log(params)
    //     if (params.data.index % 2 === 0) {
    //         return 'rules-odd-row';
    //     } else {
    //         return 'rules-even-row';
    //     }
    // };

    return <div>
        <div className={showModifyRules ? "addRuleViewContainerActive" : "addRuleViewContainerHidden"}>
                <ModifyRulesView
                    showModifyRules={showModifyRules}
                    setShowModifyRules={setShowModifyRules}
                    rulesData={props.rulesData}
                    setRulesData={props.setRulesData}
                />
            </div>
            <div className="mainContent">
            <div className="rulesViewContainer">
                <div>
                    <div className="pageTitle"><b>Rules</b></div>
                    <div className="pageTitleDescription">Here you can view and edit rules.</div>
                </div>
                <button type="button" id="btn" onClick={() => setShowModifyRules(true)}>Add a rule</button>
                <div className="ag-theme-balham-dark">
                    <AgGridReact
                        rowData={displayedRuleData}
                        columnDefs={colDefs}
                        // getRowClass={getRowClass}
                        // ref={gridRef}
                        // onCellClicked={onCellClicked}
                        // onComponentStateChanged={onComponentStateChanged}
                        // onCellEditingStopped={onCellEditingStopped}
                    />
                </div>
            </div>
        </div>
    </div>;
}