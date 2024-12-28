import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useCallback, useEffect, useRef, useState } from "react";


export function AnalyticsSelector(props: {
    // categoryData: Category[],
    // transactionData: Transaction[]
    categoryData: string[],
    enabledCategories: string[],
    setEnabledCategories: Function,
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
            <select>
                <option>Single period</option>
                <option>Over Time</option>
            </select>
        </div>
        <div className="analyticsSelectorOption">
            Time Period
            <select>
                <option>Monthly</option>
                <option>Yearly</option>
                {/* for single period only
                <option>Lifetime</option>
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
            <select>
                <option>Table</option>
                <option>Bar</option>
                <option>Sankey</option>
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