import ReactECharts from 'echarts-for-react';
import { Transaction } from '../../classes/transaction';
import { calculateData, getDateMapKey } from './data';
import { CalendarDate } from 'calendar-date';

export function SankeyChart(props: {
    transactionData: Transaction[],
    enabledCategories: string[],
    startDate: CalendarDate,
    endDate: CalendarDate,
}) {
    if (props.transactionData == null || props.enabledCategories == null) {
        return <></>;
    }

    const [displayedCategoriesMap, dateKeyDates] = calculateData(
        props.transactionData,
        props.enabledCategories,
        'LIFETIME',
        props.startDate,
        props.endDate,
        true
    );

    if (displayedCategoriesMap == null || dateKeyDates == null) {
        return <></>;
    }

    const transactionNodeNames: any[] = [{name: 'Transactions', depth: 0}];
    const links: any[] = [];
    for (let [categoryId, dateMap] of displayedCategoriesMap) {
        const amount: number = dateMap.get('LIFETIME_DATEMAPKEY');
        if (amount == null || amount <= 0) {
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
        left: '3%',
        top: 0,
        right: '8%',
        bottom: '2%',
        nodeGap: 25,
        data: transactionNodeNames,
        links: links,
        label: {
            color: "#f5f5f5",
            fontSize: 'small',
            formatter: function(d: any) {
                return d.name.substring(d.name.lastIndexOf('/') + 1) + '\n' + d.value.toFixed(2);
            }
        },
    }};

    return <ReactECharts option={options} style={{width: '100%', height: '100%'}} notMerge={true}/>;
}