import { createRoot } from 'react-dom/client';
import TransactionsView from './pages/transactions/transactions-view';
import { useState } from 'react';
import { Transaction } from './classes/transaction';
import { Source } from './classes/source';
import localStorage = require('local-storage');
import SourcesView from './pages/sources/sources-view';
import {
  Route,
  HashRouter,
  Routes,
} from "react-router-dom";
import SidebarNav from "./components/sidebar-nav";

function App() {
    const [transactionsData, setTransactionsData] = useState<Transaction[]>(null);

    // localStorage.clear();
    const storedSourceData: Source[] = JSON.parse(localStorage.get('source-data-config'));
    if (storedSourceData != null) {
        console.log(storedSourceData);
    }
    const [sourceData, setSourceData] = useState<Source[]>(storedSourceData);

    function setAndStoreSourceData(sourceData: Source[]) {
        setSourceData(sourceData);
        localStorage.set('source-data-config', JSON.stringify(sourceData));
    }
    // async function onClickOpenFile() {
    //     const transactions: Transaction[] = await window.electronAPI.handleOpenDialogReadCsvs();
    //     setRowData(transactions);
    // }

    // return <div>
    //     <SourcesView sources={sourceData} setSourceData={setSourceData}/>
    //     <button type="button" id="btn" onClick={onClickOpenFile}>Open a File</button>
    //     File path: <strong id="filePath"></strong>
    //     <TransactionsView transactions={rowDatas}/>
    // </div>;

    return <HashRouter>
        <SidebarNav/>
        <Routes>
            <Route path="/" element={
            <TransactionsView
                transactionData={transactionsData}/>
            }/>
            <Route path="/sources" element={
            <SourcesView
                sourceData={sourceData}
                setSourceData={(sourceData: Source[]) => setAndStoreSourceData(sourceData)}/>
            }/>
        </Routes>
    </HashRouter>;
}

const root = createRoot(document.body);
root.render(<App />);