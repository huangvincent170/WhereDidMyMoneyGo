
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useEffect, useRef, useState } from "react";
import { AnalyticsSelector } from "./analytics-selector";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineGraph } from "./rechart-components";


export function AnalyticsView(props: {
    categoryData: string[],
    transactionData: Transaction[]
}) {

    const [enabledCategories, setEnabledCategories] = useState(null);
    const [displayedCategories, setDisplayedCategories] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [timePeriod, setTimePeriod] = useState("MONTHLY");

    function GetDisplayedCategoryKey(transaction: Transaction) {
        const categoryKeys = displayedCategories.filter((dck: string) => transaction.category.startsWith(dck));
        if (categoryKeys.length > 1) {
            throw new Error(`transaction ${transaction} more than one cat key ${categoryKeys}`);
        }

        if (categoryKeys.length == 0) {
            throw new Error(`transaction ${transaction.category} no cat key`);
        }

        return categoryKeys[0];
    }

    function getDateMapKey(date: Date) {
        if (timePeriod == "MONTHLY") {
            return `${date.getFullYear()}-${date.getMonth()}`;
        } else if (timePeriod == "YEARLY") {
            return `${date.getFullYear()}`;
        } else if (timePeriod == "SINGLE") {
            return "SINGLEDATEMAPKEY";
        }

        throw new Error(`Unsupported timePeriod ${timePeriod}`);
    }

    function normalizeDate(date: Date) {
        return new Date(
            timePeriod == "YEARLY" || timePeriod == "MONTHLY" ? date.getFullYear() : 1,
            timePeriod == "MONTHLY" ? date.getMonth() : 1,
            1
        );
    }

    function incrementDate(date: Date) {
        if (timePeriod == "MONTHLY") {
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        } else if (timePeriod == "YEARLY") {
            return new Date(date.getFullYear() + 1, 1, 1);
        } else if (timePeriod == "SINGLE") {
            return new Date(9999, 1, 1);
        }

        throw new Error(`Unsupported timePeriod ${timePeriod}`);
    }

    function calculateGraphData() {
        if (props.transactionData == null || displayedCategories == null) {
            return;
        }

        const displayedCategoriesMap = new Map<string, Map<string, number>>(
            displayedCategories.map((displayedCategory: string) => [displayedCategory, new Map<string, number>()])
        );
    
        for (let transaction of props.transactionData) {
            if (Transaction.IsHiddenCategory(transaction.category)) {
                continue;
            }

            const categoryKey = GetDisplayedCategoryKey(transaction);
            const dateMap = displayedCategoriesMap.get(categoryKey);
            const dateMapKey = getDateMapKey(transaction.date);
            dateMap.set(dateMapKey, dateMap.has(dateMapKey) ? dateMap.get(dateMapKey) + transaction.amount : transaction.amount);
        }
        console.log(displayedCategories);

        const firstDate: Date = props.transactionData[0].date; // assumes transactions are sorted by date
        const lastDate: Date = props.transactionData[props.transactionData.length - 1].date;
        const dateKeyDates: Date[] = [];
        for (let curDate = normalizeDate(firstDate); curDate <= normalizeDate(lastDate); curDate = incrementDate(curDate)) {
            dateKeyDates.push(curDate);
        }
        console.log(dateKeyDates);

        const data: any[] = [];
        for (let dateKeyDate of dateKeyDates) {
            const dataEntry: any = { date: dateKeyDate };
            for (let [catKey, dateMap] of displayedCategoriesMap) {
                dataEntry[catKey] = dateMap.get(getDateMapKey(dateKeyDate)) ?? 0;
            }
            data.push(dataEntry);
        }
        console.log(data);

        setGraphData(data);
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


    useEffect(() => {
        setEnabledCategories(new Set<string>(props.categoryData));
    }, [props.categoryData]);

    useEffect(calculateGraphData, [props.transactionData, displayedCategories]);

    useEffect(() => {
        if (enabledCategories == null) {
            return;
        }

        const enabledCategoriesArr: string[] = Array.from(enabledCategories);
        setDisplayedCategories(enabledCategoriesArr
            .filter((ec: string) => enabledCategoriesArr.filter((_ec: string) => _ec.startsWith(ec)).length == 1));
    }, [enabledCategories]);

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
                <div className="analyticsGrid">
                    <LineGraph
                        graphData={graphData}
                        displayedCategories={displayedCategories}/>
                </div>
            </div>
        </div>
    </div>;
}