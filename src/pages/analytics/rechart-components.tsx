import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sankey, Layer, Rectangle } from 'recharts';
import { useEffect, useRef, useState } from "react";
import { Transaction } from '../../classes/transaction';

function MonthYearFormat(date: Date): string {
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().substr(-2)}`
}
export function CustomXAxisTick(...args: any[]) {
    // console.log(args);
    const { x, y, stroke, payload } = args[0];

    return <g transform={`translate(${x},${y})`}>
        <text x={20} y={0} dy={16} textAnchor="end" fill="#666" style={{fontSize: 'small'}}>
            {MonthYearFormat(payload.value)}
        </text>
    </g>
}

// export function CustomYAxisTick() {
// }

export function CustomTooltip(...args: any[]) {
    const { recentMouseIdx, active, payload, label } = args[0];

    if (active && recentMouseIdx != null) {
        return (
            <div className="tooltip">
                <p>{MonthYearFormat(label)}</p>
                {
                    payload
                        .filter((load: any) => load.value > 0)
                        .map((load: any) => <p key={load.name}>{`${load.name} : ${load.value}`}</p>)
                }
            </div>
        );
    }
    return null;
      
}

export function LineGraph(props: {
    transactionData: Transaction[],
    enabledCategories: string[],
    timePeriod: string,
}) {
    if (props.transactionData == null || props.enabledCategories == null) {
        return <></>;
    }

    const [recentMouseLineIdx, setRecentMouseLineIdx] = useState(null);

    const displayedCategories = props.enabledCategories.filter((ec: string) =>
        props.enabledCategories.filter((_ec: string) => _ec.startsWith(ec)).length == 1);

    const displayedCategoriesMap = new Map<string, Map<string, number>>(
        displayedCategories.map((displayedCategory: string) => [displayedCategory, new Map<string, number>()])
    );

    function GetDisplayedCategoryKey(transaction: Transaction) {
        const categoryKeys = displayedCategories.filter((dck: string) => transaction.category.startsWith(dck));
        if (categoryKeys.length > 1) {
            throw new Error(`transaction ${transaction} more than one cat key ${categoryKeys}`);
        }

        if (categoryKeys.length == 0) {
            throw new Error(`transaction ${transaction.category} no cat key`);
        }

        return categoryKeys[0];
    }

    function getDateMapKey(date: Date) {
        if (props.timePeriod == "MONTHLY") {
            return `${date.getFullYear()}-${date.getMonth()}`;
        } else if (props.timePeriod == "YEARLY") {
            return `${date.getFullYear()}`;
        } else if (props.timePeriod == "LIFETIME") {
            return "LIFETIMEDATEMAPKEY";
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
        } else if (props.timePeriod == "LIFETIME") {
            return new Date(9999, 1, 1);
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
    console.log("displayed " + displayedCategories);

    const firstDate: Date = props.transactionData[0].date; // assumes transactions are sorted by date
    const lastDate: Date = props.transactionData[props.transactionData.length - 1].date;
    const dateKeyDates: Date[] = [];
    for (let curDate = normalizeDate(firstDate); curDate <= normalizeDate(lastDate); curDate = incrementDate(curDate)) {
        dateKeyDates.push(curDate);
    }
    console.log("datekeydates " + dateKeyDates);

    const graphData: any[] = [];
    for (let dateKeyDate of dateKeyDates) {
        const dataEntry: any = { date: dateKeyDate };
        for (let [catKey, dateMap] of displayedCategoriesMap) {
            dataEntry[catKey] = dateMap.get(getDateMapKey(dateKeyDate)) ?? 0;
        }
        graphData.push(dataEntry);
    }
    console.log("data " + graphData);

    // setGraphData(data);
    

    return <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graphData}>
            <XAxis dataKey="date"
                tick={<CustomXAxisTick/>}
                interval={0}/>
            <YAxis style={{fontSize: 'small'}}
                width={40}/>
            <Tooltip content={<CustomTooltip recentMouseIdx={recentMouseLineIdx}/>} animationDuration={0}/>
            {/* <Legend /> */}
            {
                displayedCategories?.map((dc: string, i: number) => 
                    <Line
                        key={i}
                        type="monotone"
                        dataKey={dc}
                        isAnimationActive={false}
                        stroke={"#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})}
                        onMouseOver={() => setRecentMouseLineIdx(i)}
                        dot={false}
                        />
                )
            }
        </LineChart>
    </ResponsiveContainer>
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
    const transactionNodeNames: string[] = ['Transactions'];
    const links: any[] = [];
    console.log(sortedCategoryAmountMap);
    for (let [categoryId, amount] of sortedCategoryAmountMap) {
        if (amount <= 0) {
            continue;
        }
        const parentId: string = categoryId.slice(0, categoryId.lastIndexOf('/') < 0 ? 0 : categoryId.lastIndexOf('/'));
        const parentIdx: number = transactionNodeNames.indexOf(parentId) < 0 ? 0 : transactionNodeNames.indexOf(parentId);
        const idx: number = transactionNodeNames.length;
        links.push({
            source: parentIdx,
            target: idx,
            value: amount
        });
        transactionNodeNames.push(categoryId)
    }

    const graphData: any = {
        nodes: transactionNodeNames.map((nodeName: string) => {return {name: nodeName};}),
        links: links
    };

    console.log(graphData);

    const colors = ['#3C898E', '#486DF0', '#6F50E5'];
    const CustomNode = (props: any): React.ReactElement => {
        return <rect x={props.x + 4} y={props.y - 2} width={props.width - 8} height={props.height + 4} fill={colors[props.payload.depth % colors.length]} rx={2.5} />;
      };

    const CustomLink = (...args: any[]) => {
        console.log(args);
        const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index, payload } = args[0];
        return <g>
            <path d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
                fill="none"
                stroke={colors[payload.source.depth % colors.length]}
                strokeOpacity={0.4}
                strokeWidth={linkWidth}
                strokeLinecap="butt" />
            <foreignObject
                x={sourceX}
                y={targetY - linkWidth / 2}
                width={Math.max(targetX, sourceX) - Math.min(targetX, sourceX)}
                height={linkWidth}
                style={{overflow: 'visible'}}>
                <div style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    padding: '0 0.5em 0 0',
                    gap: 8
                }}>
                    <div style={{
                        fontSize: 10,
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                        backgroundColor: '#f1f5fe80',
                        padding: '0.25em 0.5em',
                        borderRadius: 4,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {payload.target.name ? `${payload.target.name}: ` : ''}
                        {payload.value}
                        &nbsp;€
                    </div>
                </div>
            </foreignObject>
        </g>;
    };

    return <ResponsiveContainer width="100%" height="100%">
        <Sankey
            width={1015}
            height={889}
            nodeWidth={20}
            nodePadding={50}
            linkCurvature={0.4}
            data={graphData}
            node={<CustomNode />}
            link={CustomLink}>
        </Sankey>
    </ResponsiveContainer>
        
}
