import { createRoot } from 'react-dom/client';
import { TransactionsView } from './pages/transactions/transactions-view';
import { useEffect, useState } from 'react';
import { Transaction } from './classes/transaction';
import { Source } from './classes/source';
import { SourcesView } from './pages/sources/sources-view';
import { Route, HashRouter, Routes } from "react-router-dom";
import { SidebarNav } from "./components/sidebar-nav";
import { RulesView } from './pages/rules/rules-view';
import { CategoriesView } from './pages/categories/categories-view';
import { AnalyticsView } from './pages/analytics/analytics-view';
import { Category } from './classes/category';
import localStorage = require('local-storage');

function App() {
    const [sourceData, setSourceData] = useState<Source[]>(null);
    const [transactionsData, setTransactionsData] = useState<Transaction[]>(null);
    const [categoryData, setCategoryData] = useState<Category[]>(null);

    function setAndStoreSourceData(sourceData: Source[]) {
        setSourceData(sourceData);
        localStorage.set('source-data-config', JSON.stringify(sourceData));
    }

    function setAndStoreCategoryData(categoryData: Category[]) {
        setCategoryData(categoryData);
        localStorage.set('category-config', JSON.stringify(categoryData));
    }

    async function refreshTransactionData(sourceData: Source[]) {
        setTransactionsData(await window.electronAPI.readDataFromSources(sourceData));
    }

    useEffect(() => {
        async function getDataAndRefreshAsync() {
            const storedCategoryData: Category[] = JSON.parse(localStorage.get('category-config'));
            if (storedCategoryData != null) {
                setCategoryData(storedCategoryData);
            } else {
                setAndStoreCategoryData([]);
            }

            const storedSourceData: Source[] = JSON.parse(localStorage.get('source-data-config'));
            if (storedSourceData != null) {
                setSourceData(storedSourceData);
                await refreshTransactionData(storedSourceData);
            } else {
                setAndStoreSourceData([]);
            }
        };

        window.electronAPI.onAppLoaded(async () => {
            getDataAndRefreshAsync();
        });
    }, [sourceData, transactionsData, categoryData]);

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
            <Route path="/categories" element={
                <CategoriesView
                    transactionData={transactionsData}
                    categoryData={categoryData}
                    setCategoryData={setAndStoreCategoryData}/>
            }/>
            <Route path="/rules" element={
                <RulesView/>
            }/>
            <Route path="/analytics" element={
                <AnalyticsView/>
            }/>
        </Routes>
    </HashRouter>;
}

const root = createRoot(document.body);
root.render(<App />);