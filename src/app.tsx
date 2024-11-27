import { createRoot } from 'react-dom/client';
import TransactionsView from './components/transactions-view';
import { useState } from 'react';
import { Transaction } from './class/transaction';

function App() {
    const [rowDatas, setRowData] = useState<Transaction[]>(null);

    async function onClickOpenFile() {
        const transactions: Transaction[] = await window.electronAPI.handleOpenDialogReadCsvs();
        setRowData(transactions);
    }

    return <div>
        <button type="button" id="btn" onClick={onClickOpenFile}>Open a File</button>
        File path: <strong id="filePath"></strong>
        <TransactionsView transactions={rowDatas}/>
    </div>;
}

const root = createRoot(document.body);
root.render(<App />);