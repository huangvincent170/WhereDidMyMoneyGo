import { createRoot } from 'react-dom/client';
import TransactionsView from './components/transactions-view';
import { useState } from 'react';
import { Transaction } from './class/transaction';
import { Source } from './class/source';
import localStorage = require('local-storage');
import SourcesView from './components/sources-view';

function App() {
    const [rowDatas, setRowData] = useState<Transaction[]>(null);
    const [sourceData, setSourceData] = useState<Source[]>(null);

    const storedSourceData: Source[] = JSON.parse(localStorage.get('source-data-config'));
    if (storedSourceData != null) {
        setSourceData(storedSourceData);
    }

    async function onClickOpenFile() {
        const transactions: Transaction[] = await window.electronAPI.handleOpenDialogReadCsvs();
        setRowData(transactions);
    }

    return <div>
        <SourcesView sources={sourceData} setSourceData={setSourceData}/>
        <button type="button" id="btn" onClick={onClickOpenFile}>Open a File</button>
        File path: <strong id="filePath"></strong>
        <TransactionsView transactions={rowDatas}/>
    </div>;
}

const root = createRoot(document.body);
root.render(<App />);