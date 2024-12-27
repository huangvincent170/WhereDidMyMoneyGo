import { GridOptions, ICellRendererComp, ICellRendererParams, RowHeightParams, GridApi, Column, CellValueChangedEvent, CellEditingStoppedEvent } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { Transaction } from "../../classes/transaction";
import { useCallback, useEffect, useRef, useState } from "react";

export function CategoriesView(props: {transactionData: Transaction[], categoryData: string[], setCategoryData: Function}) {
    class DisplayedCategory {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
    }

    function createDisplayedCategories(categories: string[]): DisplayedCategory[] {
        return categories?.map((c: string) => new DisplayedCategory(c));
    }

    function onCellClicked(params: any) {
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            const action = params.event.target.dataset.action;
            if (action === "delete") {
                if (props.categoryData.filter(c => c.startsWith(params.node.data.name)).length > 1) {
                    console.log("have to delete parent first!");
                    return;
                }
                props.setCategoryData(props.categoryData.filter(category => category != params.node.data.name));
            }
        }
    }
    
    function ActionCellRenderer() {
        return <div>
            <button data-action="delete"> delete </button>
        </div>;
    }

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "name",
            editable: (params: any) => params.data.name == "" || params.data.name == null
        },
        {
            headerName: "",
            cellRenderer: ActionCellRenderer,
            editable: false,
            colId: "action"
        }
    ]);

    const [displayedCategoryData, setDisplayedCategoryData] = useState(null);
    const gridRef = useRef<AgGridReact<DisplayedCategory>>();

    function addNewCategory() {
        if (displayedCategoryData == null) {
            return;
        }

        if (!displayedCategoryData.some((dc: DisplayedCategory) => dc.name == "" || dc.name == null)) {
            setDisplayedCategoryData(displayedCategoryData.concat(new DisplayedCategory("")));
        }
    }

    // returns null if valid
    function validateCategoryId(categoryId: string): string {
        if (categoryId == null || categoryId == "" || categoryId.endsWith("/")) {
            return "name must be nonempty";
        }

        if (Transaction.IsHiddenCategory(categoryId)) {
            return "name cannot be deleted, split, or uncategorized";
        }

        if (categoryId.includes("//")) {
            return "name cannot contain empty parent category";
        }

        return null;
    }

    function onCellEditingStopped(e: CellEditingStoppedEvent<DisplayedCategory>) {
        console.log(e);

        const validateError: string = validateCategoryId(e.newValue);
        if (validateError != null) {
            console.log(validateError);
            setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
            return;
        }
        
        if (e.oldValue != "" && e.oldValue != null) {
            console.log("renames not supported right now");
            setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
            return;
        }

        if (props.categoryData.some((c: string) => c == e.newValue)) {
            console.log("category already exists!");
            setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
            return;
        }

        const splitCategoryNames: string[] = e.newValue.split('/');
        let categoriesToAdd: string[] = []
        for (let i = 0; i < splitCategoryNames.length; i++) {
            const parentCategoryName: string = splitCategoryNames.slice(0, i+1).join('/');
            if (!props.categoryData.some((c: string) => c == parentCategoryName)) {
                categoriesToAdd.push(parentCategoryName);
            }
        }
        const newCategories = props.categoryData.concat(categoriesToAdd);
        newCategories.sort();
        props.setCategoryData(newCategories);
    }

    function onComponentStateChanged() {
        if (displayedCategoryData == null) {
            return;
        }
        for (let i = 0; i < displayedCategoryData.length; i++) {
            if (displayedCategoryData[i].name == "") {
                gridRef.current.api.startEditingCell({rowIndex: i, colKey: "name"});
            }
        }
    }

    useEffect(() => {
        setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
    }, [props.categoryData]);
    
    return <div className="mainContent">
        <div className="viewContainer">
            <div className="pageTitle">
                <h1>Categories</h1>
                <h2>Here you can view and edit transaction categories.</h2>
            </div>
            <div className="gridHeader">
                <button onClick={addNewCategory}>Add a category</button>
            </div>
            <div className="ag-theme-balham-dark outer-cell fullPageGrid">
                <AgGridReact
                    rowData={displayedCategoryData}
                    columnDefs={colDefs}
                    ref={gridRef}
                    onCellClicked={onCellClicked}
                    onCellEditingStopped={onCellEditingStopped}
                    onComponentStateChanged={onComponentStateChanged}
                    stopEditingWhenCellsLoseFocus={true}/>
            </div>
        </div>
    </div>;
}