
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useEffect, useRef, useState } from "react";
import { AnalyticsSelector } from "./analytics-selector";
import { LineGraph, SankeyGraph } from "./echart-components";



export function AnalyticsView(props: {
    categoryData: string[],
    transactionData: Transaction[]
}) {

    const [enabledCategories, setEnabledCategories] = useState(null);
    const [graphType, setGraphType] = useState("LINE");
    const [timeType, setTimeType] = useState("OVERTIME");
    const [timePeriod, setTimePeriod] = useState("MONTHLY");

    useEffect(() => {
        setEnabledCategories(props.categoryData);
    }, [props.categoryData]);

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
                <div className="analyticsGrid">
                    <div style={graphType == "LINE" ? null : {display: 'none'}}>
                        <LineGraph
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}/>
                    </div>
                    <div style={graphType == "SANKEY" ? null : {display: 'none'}}>
                        <SankeyGraph
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}/>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}