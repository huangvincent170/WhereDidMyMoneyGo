
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useCallback, useEffect, useRef, useState } from "react";
import { AnalyticsSelector } from "./analytics-selector";

export class DisplayedCategory {
    name: string;
    amount: number;
    children: DisplayedCategory[];
    displayed: boolean;

    constructor(
        name: string,
        amount?: number,
        children?: DisplayedCategory[],
        displayed?: boolean,
    ) {
        this.name = name;
        this.amount = amount ?? 0;
        this.children = children ?? [];
        this.displayed = displayed ?? true;
    }
}

export function AnalyticsView(props: {
    categoryData: string[],
    transactionData: Transaction[]
}) {

    function createDisplayedCategories(categories: string[]): DisplayedCategory[] {
        if (categories == null) {
            return null;
        }

        let displayedCategories: DisplayedCategory[] = [];
        for (const category of categories) {
            const splitCategoryNames: string[] = category.split('/');
            let parentDisplayedCategoryChildren = displayedCategories;
            for (let i = 0; i < splitCategoryNames.length; i++) {
                let curCategoryName = splitCategoryNames.slice(1, i+1).reduce((nameStr, subName) => nameStr + '/' + subName, splitCategoryNames[0]);
                let curDisplayedCategory = parentDisplayedCategoryChildren.find(displayedCategory => displayedCategory.name == curCategoryName);
                if (curDisplayedCategory == null) {
                    curDisplayedCategory = new DisplayedCategory(curCategoryName);
                    parentDisplayedCategoryChildren.push(curDisplayedCategory)
                }
                // curDisplayedCategory.amount += category.amount;
                parentDisplayedCategoryChildren = curDisplayedCategory.children;
            }
        }

        // flatten categories
        function dfs(categories: DisplayedCategory[]): DisplayedCategory[] {
            let traversal: DisplayedCategory[] = [];
            for (let category of categories) {
                traversal.push(category);
                if (category.children.length != 0) {
                    traversal = traversal.concat(dfs(category.children));
                }
            }
            return traversal;
        }

        let flattenedDisplayedCategories: DisplayedCategory[] = dfs(displayedCategories);
        console.log(flattenedDisplayedCategories);

        return flattenedDisplayedCategories;
    }

    
    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "name",
            editable: true
        },
        { field: "amount" },
        // {
        //     headerName: "",
        //     cellRenderer: ActionCellRenderer,
        //     editable: false,
        //     colId: "action"
        // }
    ]);

    const [displayedCategoryData, setDisplayedCategoryData] = useState(null);

    useEffect(() => {
        setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
    }, [props.categoryData]);

    function displayCategory(idx: number, display: boolean) {
        setDisplayedCategoryData(displayedCategoryData.map((dc: DisplayedCategory, i: number) =>
            i == idx ?
            new DisplayedCategory(dc.name, dc.amount, dc.children, display) :
            dc));
    }

    return <div className="mainContent">
        <div className="viewContainer">
            <div className="pageTitle">
                <h1>Analytics</h1>
                <h2>Todo</h2>
            </div>
            {/* <div className="gridHeader">
                <button onClick={() => props.refreshTransactionData()}>refresh</button>
            </div> */}
            <div className="analyticsContainer">
                <AnalyticsSelector
                    displayedCategoryData={displayedCategoryData}
                    setDisplayed={displayCategory}/>
                <div className="ag-theme-balham-dark fullPageGrid analyticsGrid">
                    <AgGridReact
                        rowData={displayedCategoryData?.filter((dc: DisplayedCategory) => dc.displayed)}
                        columnDefs={colDefs}/>
                </div>
            </div>
        </div>
    </div>;
}