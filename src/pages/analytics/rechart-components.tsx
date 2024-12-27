import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useRef, useState } from "react";

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

export function LineGraph(props: {graphData: any[], displayedCategories: string[]}) {
    const [recentMouseLineIdx, setRecentMouseLineIdx] = useState(null);

    return <ResponsiveContainer width="100%" height="100%">
        <LineChart data={props.graphData}>
            <XAxis dataKey="date"
                tick={<CustomXAxisTick/>}
                interval={0}/>
            <YAxis style={{fontSize: 'small'}}
                width={40}/>
            <Tooltip content={<CustomTooltip recentMouseIdx={recentMouseLineIdx}/>} animationDuration={0}/>
            {/* <Legend /> */}
            {
                props.displayedCategories?.map((dc: string, i: number) => 
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
