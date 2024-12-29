import ReactECharts from 'echarts-for-react';
import { Transaction } from '../../classes/transaction';
import { renderToStaticMarkup } from 'react-dom/server';

export function LineGraph(props: {
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string,
}) {
    if (props.transactionData == null || props.enabledCategories == null || props.timePeriod == null) {
        return <></>;
    }

    const displayedCategories = props.enabledCategories.filter((ec: string) =>
        props.enabledCategories.filter((_ec: string) => _ec.startsWith(ec)).length == 1);

    const displayedCategoriesMap = new Map<string, Map<string, number>>(
        displayedCategories.map((displayedCategory: string) => [displayedCategory, new Map<string, number>()])
    );

    function GetDisplayedCategoryKey(transaction: Transaction) {
        const categoryKeys = displayedCategories.filter((dck: string) => transaction.category.startsWith(dck));
        if (categoryKeys.length != 1) {
            throw new Error(`transaction ${transaction} unexpected number of cat keys ${categoryKeys.length}: ${categoryKeys}`);
        }
        return categoryKeys[0];
    }

    function getDateMapKey(date: Date) {
        if (props.timePeriod == "MONTHLY") {
            return `${date.getFullYear()}-${date.getMonth().toString().padStart(2,"0")}`;
        } else if (props.timePeriod == "YEARLY") {
            return `${date.getFullYear()}`;
        }
        throw new Error(`Unsupported timePeriod ${props.timePeriod}`);
    }

    function normalizeDate(date: Date) {
        return new Date(
            props.timePeriod == "YEARLY" || props.timePeriod == "MONTHLY" ? date.getFullYear() : 1,
            props.timePeriod == "MONTHLY" ? date.getMonth() : 1,
            1
        );
    }

    function incrementDate(date: Date) {
        if (props.timePeriod == "MONTHLY") {
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        } else if (props.timePeriod == "YEARLY") {
            return new Date(date.getFullYear() + 1, 1, 1);
        }
        throw new Error(`Unsupported timePeriod ${props.timePeriod}`);
    }

    for (let transaction of props.transactionData) {
        if (Transaction.IsHiddenCategory(transaction.category)) {
            continue;
        }

        if (!displayedCategories.some((displayedCategory: string) => transaction.category.startsWith(displayedCategory))) {
            continue;
        }

        const categoryKey = GetDisplayedCategoryKey(transaction);
        const dateMap = displayedCategoriesMap.get(categoryKey);
        const dateMapKey = getDateMapKey(transaction.date);
        dateMap.set(dateMapKey, dateMap.has(dateMapKey) ? dateMap.get(dateMapKey) + transaction.amount : transaction.amount);
    }

    const firstDate: Date = props.transactionData[0].date; // assumes transactions are sorted by date
    const lastDate: Date = props.transactionData[props.transactionData.length - 1].date;
    const dateKeyDates: Date[] = [];
    for (let curDate = normalizeDate(firstDate); curDate <= normalizeDate(lastDate); curDate = incrementDate(curDate)) {
        dateKeyDates.push(curDate);
    }

    const series: any[] = [];
    for (let [categoryId, dateMap] of displayedCategoriesMap) {
        const data = dateKeyDates.map((dateKey: Date) => dateMap.get(getDateMapKey(dateKey)) ?? 0);
        series.push({
            name: categoryId,
            type: 'line',
            data: data,
            smooth: true,
            symbol: 'none',
        });
    }

    const options: any = {
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                return renderToStaticMarkup(<div>
                    <p>{params[0].axisValue}</p>
                    {
                        params.filter((param: any) => param.value > 0)
                            .sort((a: any, b: any) => a.value < b.value ? 1 : -1)
                            .map((param: any) =>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p style={{color: param.color}}>{param.seriesName}&emsp;</p><p>{param.value.toFixed(2)}</p>
                            </div>)
                    }
                </div>);
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateKeyDates.map((dateKey: Date) => `${dateKey.toLocaleString('default', { month: 'short' })} ${dateKey.getFullYear().toString().substr(-2)}`)
        },
        yAxis: {
            type: 'value'
        },
        series: series
    }
    return <ReactECharts option={options} />;
}

export function SankeyGraph(props: {transactionData: Transaction[], enabledCategories: string[]}) {
    if (props.transactionData == null || props.enabledCategories == null) {
        return <></>;
    }

    const categoryAmountMap: Map<string, number> = new Map<string, number>(
        props.enabledCategories.map((enabledCategory: string) => [enabledCategory, 0])
    );
    for (let transaction of props.transactionData) {
        for (let enabledCategory of props.enabledCategories) {
            if (transaction.category.startsWith(enabledCategory)) {
                categoryAmountMap.set(enabledCategory, categoryAmountMap.get(enabledCategory) + transaction.amount);
            }
        }
    }

    const sortedCategoryAmountMap = [...categoryAmountMap.entries()].sort();
    const transactionNodeNames: any[] = [{name: 'Transactions', depth: 0}];
    const links: any[] = [];
    for (let [categoryId, amount] of sortedCategoryAmountMap) {
        if (amount <= 0) {
            continue;
        }

        let parentId: string = categoryId.split('/').slice(0, -1).join('/');
        if (parentId == '') {
            parentId = 'Transactions';
        }

        links.push({
            source: parentId,
            target: categoryId,
            value: amount
        });

        transactionNodeNames.push({name: categoryId, depth: categoryId.split('/').length});
    }

    const options = { series: {
        type: 'sankey',
        layout: 'none',
        emphasis: {
            focus: 'trajectory'
        },
        data: transactionNodeNames,
        links: links,
        label: {
            color: "#f5f5f5",
            fontSize: 'small',
            formatter: function(d: any) {
                return d.name.substring(d.name.lastIndexOf('/') + 1) + ' ' + d.value.toFixed(2);
            }
        },
    }};

    return <ReactECharts option={options} />;
}