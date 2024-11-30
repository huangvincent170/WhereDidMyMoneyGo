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
    const [sourceData, setSourceData] = useState<Source[]>(null);
    const [transactionsData, setTransactionsData] = useState<Transaction[]>(null);

    function setAndStoreSourceData(sourceData: Source[]) {
        setSourceData(sourceData);
        localStorage.set('source-data-config', JSON.stringify(sourceData));
    }

    async function refreshTransactionData(sourceData: Source[]) {
        setTransactionsData(await window.electronAPI.handleReadDataFromSources(sourceData));
    }

    window.electronAPI.onAppLoaded(async () => {
        const storedSourceData: Source[] = JSON.parse(localStorage.get('source-data-config'));;
        if (storedSourceData != null) {
            setSourceData(storedSourceData);
            await refreshTransactionData(storedSourceData);
        }
    });

    return <HashRouter>
        <SidebarNav/>
        <Routes>
            <Route path="/" element={
            <TransactionsView
                transactionData={transactionsData}
                refreshTransactionData={async () => refreshTransactionData(sourceData)}/>
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