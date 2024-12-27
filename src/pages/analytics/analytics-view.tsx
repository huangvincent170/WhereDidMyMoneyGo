
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useEffect, useRef, useState } from "react";
import { AnalyticsSelector } from "./analytics-selector";

export function calculateGraphData(
    transactionData: Transaction[],
    enabledCategories: string[]
): any[] {
    if (transactionData == null || enabledCategories == null) {
        return;
    }

    const displayedCategoryKeys = enabledCategories
        .filter((ec: string) => enabledCategories.filter((_ec: string) => _ec.startsWith(ec)).length == 1);
    const displayedCategories: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
    for (let dck of displayedCategoryKeys) {
        displayedCategories.set(dck, new Map<string, number>());
    }

    for (let transaction of transactionData) {
        if (transaction.category == "UNCATEGORIZED") {
            continue;
        }
        const categoryKeys = displayedCategoryKeys.filter((dck: string) => transaction.category.startsWith(dck));
        if (categoryKeys.length > 1) {
            console.log(`more than one cat key ${categoryKeys}`);
            return;
        }
        if (categoryKeys.length == 0) {
            console.log(`no cat key ${transaction.category}`);
            continue;
        }

        const categoryKey = categoryKeys[0];
        const dateMap = displayedCategories.get(categoryKey);
        const yearMonthStr = `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`;
        if (!dateMap.has(yearMonthStr)) {
            dateMap.set(yearMonthStr, 0);
        }
        dateMap.set(yearMonthStr, dateMap.get(yearMonthStr) + transaction.amount);
    }

    console.log(displayedCategories);

    // if (timePeriod == "MONTHLY") {

    // } else if (timePeriod == "YEARLY") {

    // } else if (timePeriod == "SINGLE") {

    // } else {
    //     throw new Error(`unexpected time period ${timePeriod}`);
    // }

    const firstDate: Date = transactionData[0].date; // assumes transactions are sorted by date
    const lastDate: Date = transactionData[transactionData.length - 1].date;
    lastDate.setDate(1);
    const months: Date[] = [];
    let curDate = new Date(firstDate);
    curDate.setDate(1);
    do {
        months.push(curDate);
        curDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1);
    } while (curDate < lastDate);
    console.log(months);

    const data: any[] = [
        ["Time"].concat(Array.from(displayedCategoryKeys))
    ];
    for (let month of months) {
        let curRow: any[] = [month];
        const yearMonthStr = `${month.getFullYear()}-${month.getMonth()}`;
        for (let [catKey, dateMap] of displayedCategories) {
            curRow.push(dateMap.get(yearMonthStr) ?? 0);
        }
        data.push(curRow);
    }
    console.log(data);
    
    return data;
}

export function AnalyticsView(props: {
    categoryData: string[],
    transactionData: Transaction[]
}) {

    const [enabledCategories, setEnabledCategories] = useState(null);
    // const [displayedCategories, setDisplayedCategories] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [timePeriod, setTimePeriod] = useState("MONTHLY");

    
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


    useEffect(() => {
        setEnabledCategories(new Set<string>(props.categoryData));
    }, [props.categoryData]);

    useEffect(() => {
        if (enabledCategories != null) {
            setGraphData(calculateGraphData(props.transactionData, Array.from(enabledCategories)));
        }
    }, [props.transactionData, enabledCategories]);

    // useEffect(() => {
    //     setDisplayedCategories(enabledCategories.filter((ec: string) => ec.startsWith(ec)).length == 1);
    // }, enabledCategories);

    // function displayCategory(idx: number, display: boolean) {
    //     setDisplayedCategoryData(displayedCategoryData.map((dc: DisplayedCategory, i: number) =>
    //         i == idx ?
    //         new DisplayedCategory(dc.name, dc.amount, display) :
    //         dc));
    // }

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
                    categoryData={props.categoryData}
                    enabledCategories={enabledCategories}
                    setEnabledCategories={setEnabledCategories}/>
                {/* <div className="ag-theme-balham-dark fullPageGrid analyticsGrid">
                    <AgGridReact
                        rowData={enabledCategories}
                        columnDefs={colDefs}/>
                </div> */}
            </div>
        </div>
    </div>;
}