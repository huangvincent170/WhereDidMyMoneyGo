import { GridOptions, CellEditingStoppedEvent, IRowNode, RowSelectedEvent } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import { Transaction } from "../../classes/transaction";
import { useCallback, useEffect, useRef, useState } from "react";
import { DropdownButtonData, GridHeaderDropdown } from "../../components/grid-header-dropdown";

export function CategoriesView(props: {transactionData: Transaction[], categoryData: string[], setCategoryData: Function}) {
    class DisplayedCategory {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
    }

    const [displayedCategoryData, setDisplayedCategoryData] = useState(null);
    const gridRef = useRef<AgGridReact<DisplayedCategory>>();

    function createDisplayedCategories(categories: string[]): DisplayedCategory[] {
        return categories?.map((c: string) => new DisplayedCategory(c));
    }

    function deleteSelectedCategories() {
        const selectedCategories: DisplayedCategory[] = gridRef.current.api.getSelectedRows();
        props.setCategoryData(props.categoryData.filter((category: string) =>
            !selectedCategories.some((selectedCategory: DisplayedCategory) => category.startsWith(selectedCategory.name))));
    }

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

    function onRowSelected(e: RowSelectedEvent) {
        if (e.node.isSelected()) {
            gridRef.current.api.forEachNode((node: IRowNode) => {
                if (node.data.name.startsWith(e.data.name)) {
                    node.setSelected(true);
                }
            });
        }
    }

    function onCellEditingStopped(e: CellEditingStoppedEvent<DisplayedCategory>) {
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

        props.setCategoryData(Transaction.AddParentCategories(e.newValue, props.categoryData));
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

    const [colDefs, setColDefs]: [any, any] = useState([
        {
            field: "name",
            editable: (params: any) => params.data.name == "" || params.data.name == null,
            flex: 1,
        },
    ]);
    
    return <div className="mainContent">
        <div className="viewContainer">
            <div className="pageTitle">
                <h1>Categories</h1>
                <h2>Here you can view and edit transaction categories.</h2>
            </div>
            <div className="gridHeader">
                <button onClick={addNewCategory}>Add a category</button>
                <GridHeaderDropdown
                    buttonData={[
                        new DropdownButtonData('Delete Selected', deleteSelectedCategories, (numSelected) => numSelected == 0),
                        new DropdownButtonData('Edit Selected', () => {console.log('edit')}, () => true),
                    ]}
                    gridRef={gridRef}/>
            </div>
            <div className="ag-theme-balham-dark outer-cell fullPageGrid">
                <AgGridReact
                    rowData={displayedCategoryData}
                    columnDefs={colDefs}
                    ref={gridRef}
                    onCellEditingStopped={onCellEditingStopped}
                    onComponentStateChanged={onComponentStateChanged}
                    stopEditingWhenCellsLoseFocus={true}
                    rowSelection={{mode: 'multiRow'}}
                    onRowSelected={onRowSelected}/>
            </div>
        </div>
    </div>;
}