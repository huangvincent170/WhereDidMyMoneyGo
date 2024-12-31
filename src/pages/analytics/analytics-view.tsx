
import { Transaction } from "../../classes/transaction";
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
                <div className="chartsContainer">
                    <div className={`chartContainer ${graphType == 'LINE' ? '' : 'hidden'}`}>
                        <LineChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                    <div className={`chartContainer ${graphType == 'BARSTACKED' ? '' : 'hidden'}`}>
                        <StackedBarChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            timePeriod={timePeriod}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                    <div className={`chartContainer ${graphType == 'SANKEY' ? '' : 'hidden'}`}>
                        <SankeyChart
                            transactionData={props.transactionData}
                            enabledCategories={enabledCategories}
                            startDate={startDate}
                            endDate={endDate}/>
                    </div>
                    <div className={`chartContainer ${graphType == 'TABLE' ? '' : 'hidden'}`}>
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