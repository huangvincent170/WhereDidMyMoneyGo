import ReactECharts from 'echarts-for-react';
import { Transaction } from '../../classes/transaction';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateData, getDateMapKey } from './data';
import { CalendarDate } from 'calendar-date';

export function LineChart(props: {
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string,
    startDate: CalendarDate,
    endDate: CalendarDate,
}) {
    if (props.transactionData == null || props.enabledCategories == null || props.timePeriod == null) {
        return <></>;
    }

    const [displayedCategoriesMap, dateKeyDates] = calculateData(
        props.transactionData,
        props.enabledCategories,
        props.timePeriod,
        props.startDate,
        props.endDate,
        false
    );

    if (displayedCategoriesMap == null || dateKeyDates == null) {
        return <></>;
    }

    const series: any[] = [];

    for (let [categoryId, dateMap] of displayedCategoriesMap) {
        const data = dateKeyDates.map((dateKey: CalendarDate) => dateMap.get(getDateMapKey(dateKey, props.timePeriod)) ?? 0);
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
                            <div style={{display: 'flex', justifyContent: 'space-between'}} key={param.seriesName}>
                                <p style={{color: param.color}}>{param.seriesName}&emsp;</p><p>{param.value.toFixed(2)}</p>
                            </div>)
                    }
                </div>);
            },
        },
        grid: {
            left: '5%',
            top: '5%',
            right: '2%',
            bottom: '10%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateKeyDates.map((dateKey: CalendarDate) => `${dateKey.toFormat('MM yy')}`)
        },
        yAxis: {
            type: 'value',
            width: 40,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#777777'
                }
            }
        },
        series: series,
    }
    return <ReactECharts option={options} style={{width: '100%', height: '100%'}} notMerge={true}/>;
}