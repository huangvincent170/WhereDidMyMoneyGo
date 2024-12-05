import { Category } from "../../classes/category";
import { GridOptions, ICellRendererComp, ICellRendererParams, RowHeightParams, GridApi, Column, CellValueChangedEvent, CellEditingStoppedEvent } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { Transaction } from "../../classes/transaction";
import { useCallback, useEffect, useRef, useState } from "react";

export function CategoriesView(props: {transactionData: Transaction[], categoryData: Category[], setCategoryData: Function}) {
    const testCategoryData: Category[] = [
        new Category("Needs/Food/Chipotle", 111.11),
        new Category("Needs/Food/Other", 7),
        new Category("Needs/Rent", 1234),
        new Category("Wants/Video Games", 0),
        new Category("Wants/Other", 0),
        new Category("Misc", 123.45),
    ]

    class DisplayedCategory {
        name: string;
        amount: number;
        children: DisplayedCategory[];

        constructor(
            name: string
        ) {
            this.name = name;
            this.amount = 0;
            this.children = [];
        }
    }

    function createDisplayedCategories(categories: Category[]): DisplayedCategory[] {
        if (categories == null) {
            return null;
        }

        let displayedCategories: DisplayedCategory[] = [];
        for (const category of categories) {
            const splitCategoryNames: string[] = category.getParentCategories();
            let parentDisplayedCategoryChildren = displayedCategories;
            for (let i = 0; i < splitCategoryNames.length; i++) {
                let curCategoryName = splitCategoryNames.slice(1, i+1).reduce((nameStr, subName) => nameStr + '/' + subName, splitCategoryNames[0]);
                let curDisplayedCategory = parentDisplayedCategoryChildren.find(displayedCategory => displayedCategory.name == curCategoryName);
                if (curDisplayedCategory == null) {
                    curDisplayedCategory = new DisplayedCategory(curCategoryName);
                    parentDisplayedCategoryChildren.push(curDisplayedCategory)
                }
                curDisplayedCategory.amount += category.amount;
                parentDisplayedCategoryChildren = curDisplayedCategory.children;
            }
        }

        // flatten categories
        function dfs(categories: DisplayedCategory[]): DisplayedCategory[] {
            let traversal: DisplayedCategory[] = [];
            for (let category of categories) {
                traversal.push(category);
                if (category.children.length != 0) {
                    traversal = traversal.concat(dfs(category.children));
                }
            }
            return traversal;
        }

        let flattenedDisplayedCategories: DisplayedCategory[] = dfs(displayedCategories);
        console.log(flattenedDisplayedCategories);

        return flattenedDisplayedCategories;
    }

    function onCellClicked(params: any) {
        if (params.column.colId === "action" && params.event.target.dataset.action) {
            let action = params.event.target.dataset.action;

            // todo make edit button work

            if (action === "delete") {
                params.api.applyTransaction({
                    remove: [params.node.data]
                });
                const newCategoryData = props.categoryData.filter(category => category.id != params.node.data.name);
                props.setCategoryData(newCategoryData);
            }
        }
    }
    
    function ActionCellRenderer() {
        // todo make look nice
        return <div>
            {/* <button data-action="edit"> Add subcategory </button> */}
            <button data-action="delete"> delete </button>
        </div>;
    }

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "name",
            editable: true
        },
        { field: "amount" },
        {
            headerName: "",
            cellRenderer: ActionCellRenderer,
            editable: false,
            colId: "action"
        }
    ]);

    const gridRef = useRef<AgGridReact<DisplayedCategory>>();

    function addNewCategory() {
        if (!displayedCategoryData.some((dc: DisplayedCategory) => dc.name == "")) {
            setDisplayedCategoryData(displayedCategoryData.concat(new DisplayedCategory("")));
        }
    }

    function onCellEditingStopped(e: CellEditingStoppedEvent<DisplayedCategory>) {
        console.log(e);
        if (e.newValue == "") {
            console.log("name must be nonempty!");
            setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
            return;
        }
        
        if (e.oldValue != "") {
            console.log("renames not supported right now");
            setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
            return;
        }

        if (displayedCategoryData.filter((dc: DisplayedCategory) => dc.name == e.newValue).length > 1) {
            console.log("category already exists!");
            setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
            return;
        }

        props.setCategoryData(props.categoryData.concat([new Category(e.newValue, 0)]));
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

    const [displayedCategoryData, setDisplayedCategoryData] = useState(null);

    useEffect(() => {
        setDisplayedCategoryData(createDisplayedCategories(props.categoryData));
    }, [props.categoryData]);
    
    return <div className="mainContent">
        <div className="categoriesViewContainer">
            <div>
                <div className="pageTitle"><b>Categories</b></div>
                <div className="pageTitleDescription">Here you can view and edit transaction categories.</div>
            </div>
            <button type="button" id="btn" onClick={addNewCategory}>Add a category</button>
            <div className="ag-theme-balham-dark outer-cell" style={{ height: 1000 }}>
                <AgGridReact
                    rowData={displayedCategoryData}
                    columnDefs={colDefs}
                    ref={gridRef}
                    onCellClicked={onCellClicked}
                    onComponentStateChanged={onComponentStateChanged}
                    onCellEditingStopped={onCellEditingStopped}
                />
            </div>
        </div>
    </div>;
}