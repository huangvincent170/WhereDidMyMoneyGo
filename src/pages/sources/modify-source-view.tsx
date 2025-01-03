import { Source } from "../../classes/source";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

export default function ModifySourcesView(props: {
    showModifySources: boolean,
    setShowModifySources: Function,
    sourceData: Source[],
    setSourceData: Function,
}) {
    const [dirSourceData, setDirSourceData] = useState(null);
    const [colDefs, setColDefs] = useState(null);
    const gridRef = useRef(null);
    const blankForm = {
        dirPath: '',
        sourceName: '',
        amountIdx: '',
        descIdx: '',
        dateIdx: '',
        isDebt: false,
        hasHeader: false,
    };
    const [formData, setFormData] = useState(blankForm);

    function handleSubmit() {
        if (formData.dirPath == '' ||
            formData.sourceName == '' ||
            formData.amountIdx == '' ||
            formData.descIdx == '' ||
            formData.dateIdx == ''
        ) {
            return;
        }

        const source: Source = new Source(
            formData.dirPath,
            formData.sourceName,
            Number(formData.amountIdx),
            Number(formData.descIdx),
            Number(formData.dateIdx),
            formData.isDebt ?? false,
            formData.hasHeader ?? false,
        );

        // todo validate data

        if (source.name == null || source.name == "") {
            console.log("source needs name!");
            return;
        }

        if (props.sourceData != null &&
            props.sourceData.some(existing => existing.name == source.name || existing.path == source.path)) {
            // todo user error
            console.log("source already exists!");
            return;
        }

        const newSourceData = props.sourceData == null ? [source] : props.sourceData.concat(source);
        props.setSourceData(newSourceData);
        props.setShowModifySources(!props.showModifySources);
        
        gridRef.current.api.setGridOption('rowData', []);
        setFormData(blankForm);
    }

    useEffect(() => {
        if (formData?.dirPath == null || formData.dirPath == '') {
            return;
        }

        const fetchAndSetDataFromDir = async() => {
            let data = await window.electronAPI.readDataFromDir(formData.dirPath, true, formData?.hasHeader ?? false);
            // console.log(data);
            if (data != null && data.length > 0) {
                setColDefs([...Array(data[0].length).keys()].map((i: number) => {
                    let headerName = `Col ${i} (unused)`;
                    if (formData.amountIdx != '' && Number(formData.amountIdx) == i) {
                        headerName = "Amount";
                    } else if (formData.dateIdx != '' && Number(formData.dateIdx) == i) {
                        headerName = "Date";
                    } else if (formData.descIdx != '' && Number(formData.descIdx) == i) {
                        headerName = "Description";
                    }

                    return {
                        headerName: headerName,
                        field: `${i}`,
                        autoHeight: true,
                        wrapText: true,
                        flex: 1,
                        resizable: true,
                    };
                }));
                gridRef.current.api.setGridOption('columnDefs', colDefs);
            }

            if (formData?.isDebt && formData?.amountIdx != null) {
                data = data.map((dataArr: any[]) => dataArr.map((val: any, i: number) => i == Number(formData?.amountIdx) ? -1 * (val as number) : val));
            }

            setDirSourceData(data);
            gridRef.current.api.setGridOption('rowData', data);
        };

        fetchAndSetDataFromDir().catch(console.error);
    }, [formData]);

    return (<div className="addView sourceAddView" hidden={!props.showModifySources}>
        <div className="addViewMain">
            <div className="addSourceContainer">
                <div className="addSourceFieldContainer">
                    <span>Source name:</span>
                    <input
                        className="addSourceLongInput"
                        value={formData?.sourceName}
                        onChange={(e) => setFormData({...formData, sourceName: e.target.value})}/>
                </div>
                <div className="addSourceFieldContainer">
                <span>Directory path:</span>
                <input
                        className="addSourceLongInput rightAlignInput"
                        name="path"
                        readOnly={true}
                        value={formData?.dirPath}
                        onClick={async () => setFormData({...formData, dirPath: await window.electronAPI.openSelectDirDialog()})} />
                </div>
                <div className="addSourceFieldContainer">
                    <span>Amount column index:</span>
                    <input
                        className="addSourceShortInput"
                        type="number"
                        value={formData?.amountIdx}
                        onChange={(e) => setFormData({...formData, amountIdx: e.target.value})}/>
                </div>
                <div className="addSourceFieldContainer">
                    <span>Date column index:</span>
                    <input className="addSourceShortInput"
                        type="number"
                        value={formData?.dateIdx}
                        onChange={(e) => setFormData({...formData, dateIdx: e.target.value})}/>
                </div>
                <div className="addSourceFieldContainer">
                    <span>Description column index:</span>
                    <input className="addSourceShortInput"
                        type="number"
                        value={formData?.descIdx}
                        onChange={(e) => setFormData({...formData, descIdx: e.target.value})}/>
                </div>
                <div className="addSourceFieldContainer">
                    <span>Is amount debt?</span>
                    <input
                        type="checkbox"
                        checked={formData?.isDebt}
                        onChange={(e) => setFormData({...formData, isDebt: e.target.checked})}/>
                </div>
                <div className="addSourceFieldContainer">
                    <span>Do files have a header line?</span>
                    <input
                        type="checkbox"
                        checked={formData?.hasHeader}
                        onChange={(e) => setFormData({...formData, hasHeader: e.target.checked})}/>
                </div>
                <div className="ag-theme-balham-dark addSourceGridContainer">
                    <AgGridReact
                        animateRows={false}
                        rowData={dirSourceData}
                        columnDefs={colDefs}
                        ref={gridRef}/>
                </div>
            </div>
        </div>
        <div className="addViewFooter">
            <div className="addViewFooterRight">
                <button type="submit" onClick={() => handleSubmit()}>Save Changes</button>
                <button type="button" onClick={() => props.setShowModifySources(false)}>Close</button>
            </div>
        </div>
    </div>);
}