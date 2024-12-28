import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";


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
                value={props.timePeriod ?? "MONTHLY"}>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="LIFETIME">Lifetime</option>
                {/* for single period only
                <option>Date Range</option> */}
            </select>
        </div>
        {/* <div>
            <span>Period Select</span>
            <select>
                // todo month or year or date range select
            </select>
        </div> */}
        <div className="analyticsSelectorOption">
            Graph Type
            <select
                onChange={(e) => props.setGraphType(e.target.value)}
                value={props.graphType ?? "LINE"}>
                <option
                    value="TABLE">
                    Table
                </option>
                <option
                    value="BARSTACKED"
                    hidden={props.timeType != "OVERTIME"}>
                    Bar (Stacked)
                </option>
                <option
                    value="BARSPLIT">
                    Bar (Split)
                </option>
                <option
                    value="SANKEY"
                    hidden={props.timeType != "SINGLE"}>
                    Sankey
                </option>
                <option
                    value="LINE"
                    hidden={props.timeType != "OVERTIME"}>
                    Line
                </option>
            </select>
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