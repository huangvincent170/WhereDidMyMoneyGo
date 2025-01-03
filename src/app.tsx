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
import { Rule } from './classes/rule';

function App() {
    const [categoryData, setCategoryData] = useState<string[]>(null);
    const [rulesData, setRulesData] = useState<Rule[]>(null);
    const [sourceData, setSourceData] = useState<Source[]>(null);
    const [transactionsData, setTransactionsData] = useState<Transaction[]>(null);

    async function setAndStoreCategoryData(categoryData: string[]) {
        setCategoryData(categoryData);
        await window.electronAPI.writeUserData('category-data', JSON.stringify(categoryData));
    }

    async function setAndStoreRulesData(rulesData: Rule[]) {
        setRulesData(rulesData);
        await window.electronAPI.writeUserData('rules-data', JSON.stringify(rulesData));
    }

    async function setAndStoreSourceData(sourceData: Source[]) {
        setSourceData(sourceData);
        await window.electronAPI.writeUserData('source-data', JSON.stringify(sourceData));
    }

    async function refreshTransactionData(sourceData: Source[], rulesData: Rule[]) {
        let transactions: Transaction[] = await window.electronAPI.readDataFromSources(sourceData);
        setTransactionsData(Rule.Execute(rulesData, transactions));
        // calculateGraphData(transactionsData, categoryData);
        // Category.setCategoryAmounts(categoryData, transactions);
    }

    useEffect(() => {
        async function getDataAndRefreshAsync() {
            const rawStoredCategoryData: string = await window.electronAPI.readUserData('category-data');
            if (rawStoredCategoryData) {
                setCategoryData(JSON.parse(rawStoredCategoryData));
            } else {
                setAndStoreCategoryData([]);
            }

            const rawStoredSourceData: string = await window.electronAPI.readUserData('source-data');
            let storedSourceData: Source[] = [];
            if (rawStoredSourceData) {
                storedSourceData = JSON.parse(rawStoredSourceData);
                setSourceData(storedSourceData);
            } else {
                setAndStoreSourceData([]);
            }

            const rawStoredRulesData: string = await window.electronAPI.readUserData('rules-data');
            let storedRulesData: Rule[] = [];
            if (rawStoredRulesData) {
                storedRulesData = JSON.parse(rawStoredRulesData);
                setRulesData(storedRulesData);
            } else {
                setAndStoreRulesData([]);
            }

            await refreshTransactionData(storedSourceData, storedRulesData);
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
                    setSourceData={(sourceData: Source[]) => setAndStoreSourceData(sourceData)}
                    transactionsData={transactionsData}/>
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
                    sourceData={sourceData}
                    transactionData={transactionsData}/>
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