import ReactECharts from 'echarts-for-react';
import { Transaction } from '../../classes/transaction';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateOvertimeData, getDateMapKey } from './data';

export function StackedBarChart(props: {
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string,
}) {
    if (props.transactionData == null || props.enabledCategories == null || props.timePeriod == null) {
        return <></>;
    }

    const [displayedCategoriesMap, dateKeyDates] = calculateOvertimeData(props.transactionData, props.enabledCategories, props.timePeriod);
    const series: any[] = [];

    for (let [categoryId, dateMap] of displayedCategoriesMap) {
        const data = dateKeyDates.map((dateKey: Date) => dateMap.get(getDateMapKey(dateKey, props.timePeriod)) ?? 0);
        series.push({
            name: categoryId,
            type: 'bar',
            data: data,
            stack: 'stack',
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                normal: {
                    barBorderWidth: 0,
                    // barBorderColor: "#000"
                }
            }
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
        grid: {
            left: '5%',
            top: '5%',
            right: '4%',
            bottom: '10%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateKeyDates.map((dateKey: Date) => `${dateKey.toLocaleString('default', { month: 'short' })} ${dateKey.getFullYear().toString().substring(2)}`)
        },
        yAxis: {
            type: 'value',
            // width: 40,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#777777'
                }
            },
            offset: 20,
        },
        series: series,
    }
    return <ReactECharts option={options} style={{width: '100%', height: '100%'}} notMerge={true}/>;
}