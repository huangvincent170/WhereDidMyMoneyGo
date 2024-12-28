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
    setTimePeriod: Function,
    setTimeType: Function,
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
            <select onChange={(e) => props.setTimeType(e.target.value)} defaultValue={"OVERTIME"}>
                <option value="SINGLE">Single period</option>
                <option value="OVERTIME">Over Time</option>
            </select>
        </div>
        <div className="analyticsSelectorOption">
            Time Period
            <select onChange={(e) => props.setTimePeriod(e.target.value)} defaultValue={"MONTHLY"}>
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
            <select onChange={(e) => props.setGraphType(e.target.value)} defaultValue={"LINE"}>
                <option value="TABLE">Table</option>
                <option value="BARSTACKED">Bar (Stacked)</option>
                <option value="BARSPLIT">Bar (Split)</option>
                <option value="SANKEY">Sankey</option>
                <option value="LINE">Line</option>
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