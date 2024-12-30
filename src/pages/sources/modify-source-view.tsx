import { Source } from "../../classes/source";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

export default function ModifySourcesView(props: {
    showModifySources: boolean,
    setShowModifySources: Function,
    sourceData: Source[],
    setSourceData: Function,
}) {
    const [sourceName, setSourceName] = useState(null);
    const [dirPath, setDirPath] = useState(null);
    const [dirSourceData, setDirSourceData] = useState(null);
    const [colDefs, setColDefs] = useState(null);
    const [amountIdx, setAmountIdx] = useState(null);
    const [dateIdx, setDateIdx] = useState(null);
    const [descIdx, setDescIdx] = useState(null);
    const [isDebt, setIsDebt] = useState(null);
    const [hasHeader, setHasHeader] = useState(null);
    const gridRef = useRef(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        event.preventDefault();

        const source: Source = new Source(
            dirPath,
            sourceName,
            Number(amountIdx),
            Number(descIdx),
            Number(dateIdx),
            isDebt,
            hasHeader,
        );
        console.log(source);

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
    }

    useEffect(() => {
        if (dirPath == null || dirPath == "") {
            return;
        }

        const fetchAndSetDataFromDir = async() => {
            console.log("calling with hasheader" + hasHeader);
            let data = await window.electronAPI.readDataFromDir(dirPath, true, hasHeader);
            // console.log(data);
            if (data != null && data.length > 0) {
                setColDefs([...Array(data[0].length).keys()].map((i: number) => {
                    let headerName = `Col ${i} (unused)`;
                    if (amountIdx == i) {
                        headerName = "Amount"
                    } else if (dateIdx == i) {
                        headerName = "Date"
                    } else if (descIdx == i) {
                        headerName = "Description"
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

            if (isDebt && amountIdx != null) {
                data = data.map((dataArr: any[]) => dataArr.map((val: any, i: number) => i == amountIdx ? -1 * (val as number) : val));
            }

            setDirSourceData(data);
        };

        fetchAndSetDataFromDir().catch(console.error);
    }, [dirPath, hasHeader, amountIdx, dateIdx, descIdx, isDebt]);

    return (<div className="addView" hidden={!props.showModifySources}>
        <form className="addSourceForm" method="post" onSubmit={handleSubmit}>
            <div className="addSourceFieldContainer">
                <span>Source name:</span>
                <input
                    className="addSourceLongInput"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}/>
            </div>
            <div className="addSourceFieldContainer">
               <span>Directory path:</span>
               <input
                    className="addSourceLongInput rightAlignInput"
                    name="path"
                    readOnly={true}
                    value={dirPath}
                    onClick={async () => setDirPath(await window.electronAPI.openSelectDirDialog())} />
            </div>
            <div className="addSourceFieldContainer">
                <span>Amount column index:</span>
                <input
                    className="addSourceShortInput"
                    value={amountIdx}
                    onChange={(e) => setAmountIdx(e.target.value)}/>
            </div>
            <div className="addSourceFieldContainer">
                <span>Date column index:</span>
                <input className="addSourceShortInput"
                    value={dateIdx}
                    onChange={(e) => setDateIdx(e.target.value)}/>
            </div>
            <div className="addSourceFieldContainer">
                <span>Description column index:</span>
                <input className="addSourceShortInput"
                    value={descIdx}
                    onChange={(e) => setDescIdx(e.target.value)}/>
            </div>
            <div className="addSourceFieldContainer">
                <span>Is amount debt?</span>
                <input
                    type="checkbox"
                    value={isDebt}
                    onChange={(e) => setIsDebt(e.target.checked)}/>
            </div>
            <div className="addSourceFieldContainer">
                <span>Do files have a header line?</span>
                <input
                    type="checkbox"
                    value={hasHeader}
                    onChange={(e) => setHasHeader(e.target.checked)}/>
            </div>
            <div className="ag-theme-balham-dark addSourceGridContainer">
                <AgGridReact
                    animateRows={false}
                    rowData={dirSourceData}
                    columnDefs={colDefs}
                    ref={gridRef}/>
            </div>
            <div className="addViewFooter">
                <div className="addViewFooterRight">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => props.setShowModifySources(false)}>Close</button>
                </div>
            </div>
        </form>
    </div>);
}