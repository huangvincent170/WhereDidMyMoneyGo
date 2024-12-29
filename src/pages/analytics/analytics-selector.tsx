import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker/dist";
import { CalendarDate } from "calendar-date";


export function AnalyticsSelector(props: {
    // categoryData: Category[],
    // transactionData: Transaction[]
    categoryData: string[],
    enabledCategories: string[],
    setEnabledCategories: Function,
    timePeriod: string,
    setTimePeriod: Function,
    timeType: string,
    setTimeType: Function,
    graphType: string,
    setGraphType: Function,
    startDate: CalendarDate,
    setStartDate: Function,
    endDate: CalendarDate,
    setEndDate: Function,
}) {
    function toggleCategory(categoryId: string): void {
        if (props.enabledCategories == null) {
            return;
        }

        if (props.enabledCategories.some((enabledCategory: string) => enabledCategory == categoryId)) {
            props.setEnabledCategories(props.enabledCategories.filter((enabledCategory: string) => !enabledCategory.startsWith(categoryId)));
        } else {
            props.setEnabledCategories(Transaction.AddParentCategories(categoryId, props.enabledCategories));
        }
    }

    return <div className="analyticsSidebar">
        <div className="analyticsSelectorOption">
            Graph Type
            <select
                onChange={(e) => props.setGraphType(e.target.value)}
                value={props.graphType ?? "LINE"}>
                <option value="TABLE">Table</option>
                <option value="BARSTACKED">Bar (Stacked)</option>
                <option value="BARSPLIT">Bar (Split)</option>
                <option value="SANKEY">Sankey</option>
                <option value="LINE">Line</option>
            </select>
        </div>
        <div className="analyticsSelectorOption"
            style={props.graphType == 'BARSTACKED' || props.graphType == 'SANKEY' || props.graphType == 'LINE' ? {display: 'none'} : {}}>
            Time Type
            <select
                onChange={(e) => props.setTimeType(e.target.value)}
                value={props.timeType ?? "OVERTIME"}>
                <option value="SINGLE">Single period</option>
                <option value="OVERTIME">Over Time</option>
            </select>
        </div>
        <div className="analyticsSelectorOption">
            Time Period
            <select
                onChange={(e) => props.setTimePeriod(e.target.value)}
                value={props.timePeriod ?? "MONTH"}>
                <option value="MONTH">{props.timeType == 'OVERTIME' ? 'Monthly' : 'Month'}</option>
                <option value="YEAR">{props.timeType == 'OVERTIME' ? 'Yearly' : 'Year'}</option>
                <option value="LIFETIME" hidden={ props.timeType != "SINGLE" }>Lifetime</option>
                <option value="RANGE" hidden={ props.timeType != "SINGLE" }>Date Range</option>
            </select>
        </div>
        <div className="analyticsSelectorOption"
            style={props.timeType == 'SINGLE' && props.timePeriod != 'RANGE' ? {display: 'none'} : {}}>
            <span>Period Start</span>
            <div className="analyticsDatePickerContainer">
                <DatePicker
                    selected={props.startDate != null ? props.startDate.toDateUTC() : null}
                    onChange={(date: Date) => props.setStartDate(date != null ? CalendarDate.fromDateUTC(date) : null)}/>
            </div>
        </div>
        <div className="analyticsSelectorOption"
            style={props.timeType == 'SINGLE' && props.timePeriod != 'RANGE' ? {display: 'none'} : {}}>
            <span>Period End</span>
            <div className="analyticsDatePickerContainer">
                <DatePicker
                    selected={props.endDate != null ? props.endDate.toDateUTC() : null}
                    onChange={(date: Date) => props.setEndDate(date != null ? CalendarDate.fromDateUTC(date) : null)}/>
            </div>
        </div>
        <div className="analyticsSelectorCategories">
            {
                props.categoryData?.map((category, i) => 
                    <div key={i} className="analyticsSelectorCategorySelector">
                        <input
                            type="checkbox"
                            className="inputCheckbox"
                            checked={props.enabledCategories?.some((enabledCategory: string) => enabledCategory == category) ?? true}
                            onChange={() => toggleCategory(category)}
                            />
                        &nbsp;{category}
                    </div>
                )
            }
        </div>
    </div>;
}