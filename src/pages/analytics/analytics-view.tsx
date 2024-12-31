
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useEffect, useRef, useState } from "react";
import { AnalyticsSelector } from "./analytics-selector";
import { LineChart } from "./line-chart";
import { SankeyChart } from "./sankey-chart";
import { StackedBarChart } from "./stacked-bar-chart";
import { CalendarDate } from "calendar-date";
import { TableChart } from "./table-chart";

export function AnalyticsView(props: {
    categoryData: string[],
    transactionData: Transaction[]
}) {

    const [enabledCategories, setEnabledCategories] = useState(null);
    const [graphType, setGraphType] = useState("LINE");
    const [timePeriod, setTimePeriod] = useState("MONTH");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        setEnabledCategories(props.categoryData);
    }, [props.categoryData]);

    useEffect(() => {
        if (graphType == 'SANKEY') {
            setTimePeriod('LIFETIME');
        } else if (graphType == 'BARSTACKED' || graphType == 'LINE') {
            setTimePeriod('MONTH');
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
                    graphType={graphType}
                    setGraphType={setGraphType}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}/>
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
                            timePeriod={timePeriod}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                    <div className="chartContainer" style={graphType == "BARSTACKED" ? null : {display: 'none'}}>
                        <StackedBarChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                    <div className="chartContainer" style={graphType == "SANKEY" ? null : {display: 'none'}}>
                        <SankeyChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                    <div className="graphChartContainer" style={graphType == "TABLE" ? null : {display: 'none'}}>
                        <TableChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}