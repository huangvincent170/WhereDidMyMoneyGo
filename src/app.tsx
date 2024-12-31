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
import localStorage = require('local-storage');
import { Rule } from './classes/rule';

function App() {
    const [categoryData, setCategoryData] = useState<string[]>(null);
    const [rulesData, setRulesData] = useState<Rule[]>(null);
    const [sourceData, setSourceData] = useState<Source[]>(null);
    const [transactionsData, setTransactionsData] = useState<Transaction[]>(null);

    function setAndStoreCategoryData(categoryData: string[]) {
        setCategoryData(categoryData);
        localStorage.set('category-data', JSON.stringify(categoryData));
    }

    function setAndStoreRulesData(rulesData: Rule[]) {
        setRulesData(rulesData);
        localStorage.set('rules-data', JSON.stringify(rulesData));
    }

    function setAndStoreSourceData(sourceData: Source[]) {
        setSourceData(sourceData);
        localStorage.set('source-data', JSON.stringify(sourceData));
    }

    async function refreshTransactionData(sourceData: Source[], rulesData: Rule[]) {
        let transactions: Transaction[] = await window.electronAPI.readDataFromSources(sourceData);
        setTransactionsData(Rule.Execute(rulesData, transactions));
        // calculateGraphData(transactionsData, categoryData);
        // Category.setCategoryAmounts(categoryData, transactions);
    }

    useEffect(() => {
        async function getDataAndRefreshAsync() {
            // localStorage.clear();
            const storedCategoryData: string[] = JSON.parse(localStorage.get('category-data'));
            if (storedCategoryData != null) {
                setCategoryData(storedCategoryData);
            } else {
                setAndStoreCategoryData([]);
            }

            const storedSourceData: Source[] = JSON.parse(localStorage.get('source-data'));
            if (storedSourceData != null) {
                setSourceData(storedSourceData);
            } else {
                setAndStoreSourceData([]);
            }

            const storedRulesData: Rule[] = JSON.parse(localStorage.get('rules-data'));
            if (storedRulesData != null) {
                setRulesData(storedRulesData);
            } else {
                setAndStoreRulesData([]);
            }

            await refreshTransactionData(storedSourceData, storedRulesData);
            // calculateGraphData(transactionsData, categoryData)
        };

        window.electronAPI.onAppLoaded(async () => {
            getDataAndRefreshAsync();
        });
    }, [sourceData, transactionsData, categoryData, rulesData]);

    return <HashRouter>
        <SidebarNav/>
        <Routes>
            <Route path="/" element={
                <TransactionsView
                    transactionData={transactionsData}
                    refreshTransactionData={async () => refreshTransactionData(sourceData, rulesData)}
                    rulesData={rulesData}
                    setRulesData={setAndStoreRulesData}
                    categoryData={categoryData}
                    sourceData={sourceData}/>
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
                <RulesView
                    categoryData={categoryData}
                    rulesData={rulesData}
                    setRulesData={setAndStoreRulesData}
                    sourceData={sourceData}/>
            }/>
            <Route path="/analytics" element={
                <AnalyticsView
                    categoryData={categoryData}
                    transactionData={transactionsData}/>
            }/>
        </Routes>
    </HashRouter>;
}

const root = createRoot(document.body);
root.render(<App />);