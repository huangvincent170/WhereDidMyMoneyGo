import { Transaction } from '../../classes/transaction';
import { calculateData, getDateMapKey } from './data';
import { CalendarDate } from 'calendar-date';
import { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

export function TableChart(props: {
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string,
    startDate: CalendarDate,
    endDate: CalendarDate,
}) {
    function getColDefAndRowData() {
        const [displayedCategoriesMap, dateKeyDates] = calculateData(
            props.transactionData,
            props.enabledCategories,
            props.timePeriod,
            props.startDate,
            props.endDate,
            true
        );

        if (displayedCategoriesMap == null || dateKeyDates == null) {
            return [];
        }

        const categoryNameCol: any[] = [
            {
                headerName: '',
                field: 'categoryName',
                pinned: 'left',
            }
        ];

        const dateKeyDateHeaders: any[] = dateKeyDates
            .map((dateKeyDate: CalendarDate) => getDateMapKey(dateKeyDate, props.timePeriod))
            .map((dateKey: string) => {
                return {
                    // todo headername
                    field: dateKey,
                    width: '80px',
                };
            });
    
        const rowData = Array.from(displayedCategoriesMap.entries()).map(([categoryId, dateMap]) => {
            let dateMapObj = Object.fromEntries(Array.from(dateMap).map(([key, val]) => [key, val.toFixed(2)]));
            (dateMapObj as any).categoryName = categoryId;
            return dateMapObj;
        });

        return [categoryNameCol.concat(dateKeyDateHeaders), rowData];
    }

    const gridRef = useRef(null);
    const [initialColDefs, initialRowData] = getColDefAndRowData();
    const [colDefs, setColDefs] = useState(initialColDefs);
    const [rowData, setRowData] = useState(initialRowData);

    useEffect(() => {
        if (props.transactionData == null ||
            props.enabledCategories == null ||
            props.timePeriod == null
        ) {
            return;
        }

        const [newColDefs, newRowData] = getColDefAndRowData();
        gridRef.current.api?.setGridOption('columnDefs', newColDefs);
        setRowData(newRowData);
    }, [props.enabledCategories, props.startDate, props.endDate, props.timePeriod]);

    return <div className="ag-theme-balham-dark fullPageGrid">
        <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            ref={gridRef}/>
    </div>;
}