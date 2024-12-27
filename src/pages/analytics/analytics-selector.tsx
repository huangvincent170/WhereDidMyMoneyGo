import { Category } from "../../classes/category";
import { Transaction } from "../../classes/transaction";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { useCallback, useEffect, useRef, useState } from "react";
import { DisplayedCategory } from "./analytics-view";

export function AnalyticsSelector(props: {
    // categoryData: Category[],
    // transactionData: Transaction[]
    displayedCategoryData: DisplayedCategory[],
    setDisplayed: Function,
}) {
    

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
                props.displayedCategoryData?.map((dc, i) => 
                    <div className="analyticsSelectorCategorySelector">
                        <input
                            type="checkbox"
                            className="inputCheckbox"
                            checked={dc.displayed}
                            onChange={() => props.setDisplayed(i, !dc.displayed)}
                            />
                        &nbsp;{dc.name}
                    </div>
                )
            }
        </div>
    </div>;
}