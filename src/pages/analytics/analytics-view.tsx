
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useEffect, useRef, useState } from "react";
import { AnalyticsSelector } from "./analytics-selector";
import { LineChart } from "./line-chart";
import { SankeyChart } from "./sankey-chart";
import { StackedBarChart } from "./stacked-bar-chart";

export function AnalyticsView(props: {
    categoryData: string[],
    transactionData: Transaction[]
}) {

    const [enabledCategories, setEnabledCategories] = useState(null);
    const [graphType, setGraphType] = useState("LINE");
    const [timeType, setTimeType] = useState("OVERTIME");
    const [timePeriod, setTimePeriod] = useState("MONTH");

    useEffect(() => {
        setEnabledCategories(props.categoryData);
    }, [props.categoryData]);

    useEffect(() => {
        if (graphType == 'SANKEY') {
            setTimeType('SINGLE');
        } else if (graphType == 'BARSTACKED' || graphType == 'LINE') {
            setTimeType('OVERTIME');
        }
    }, [graphType]);

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
                    setEnabledCategories={setEnabledCategories}
                    timePeriod={timePeriod}
                    setTimePeriod={setTimePeriod}
                    timeType={timeType}
                    setTimeType={setTimeType}
                    graphType={graphType}
                    setGraphType={setGraphType}/>
                {/* <div className="ag-theme-balham-dark fullPageGrid analyticsGrid">
                    <AgGridReact
                        rowData={enabledCategories}
                        columnDefs={colDefs}/>
                </div> */}
                <div className="chartsContainer">
                    <div className="chartContainer" style={graphType == "LINE" ? null : {display: 'none'}}>
                        <LineChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}/>
                    </div>
                    <div className="chartContainer" style={graphType == "BARSTACKED" ? null : {display: 'none'}}>
                        <StackedBarChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}/>
                    </div>
                    <div className="chartContainer" style={graphType == "SANKEY" ? null : {display: 'none'}}>
                        <SankeyChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}/>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}