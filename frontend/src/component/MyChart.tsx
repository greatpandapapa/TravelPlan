import { Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, Sector } from 'recharts';

type PieGraphProps = {
    data:{name:string,value:number}[] 
}
/**
 * 予算の円グラフ
 */
export function MyPieChart(props:PieGraphProps) {
    const data = props.data;

    // #endregion
    const RADIAN = Math.PI / 180;
    const COLORS = ['#4169e1','#98fb98','#ffb6c1','#ffdab9','#40e0d0','#7fffd4','#ffff00','#ffa07a','#ffc0cb','#6a5acd','#afeeee','#7cfc00','#a52a2a','#9400d3','#696969'];
    const FONT_COLORS = ['white','black',   'black',     'black',   'black',     'black',    'black',    'black',    'black',     'white','black','black','white','white','white'];

    // カスタムラベル
    const renderCustomizedLabel = (props: PieLabelRenderProps) => {
        /**
         * propsの詳細
         * https://sqlrooms.org/api/recharts/interfaces/PieLabelRenderProps.html
         * 
         * cx: 
         * cy:
         * innrRadius: 内径の半径
         * outerRadius: 外形の半径
         * midAngle: エリアの真ん中の半径
         */
        const radius = props.innerRadius + (props.outerRadius - props.innerRadius) * 0.5;
        const ncx = Number(props.cx);
        const ncy = Number(props.cy);
        // エリアの中央の座標
        let x = ncx + radius * Math.cos(-(props.midAngle ?? 0) * RADIAN) ;
        x = x + (x > ncx? 20:-20);
        let y = ncy + radius * Math.sin(-(props.midAngle ?? 0) * RADIAN);

        // 狭いエリアは外側に配置する
        if (props.percent !== undefined && props.percent < 0.05) {
            x = props.x;
            y = props.y;
        }        

        let label:string = ""
        // 値が0かパーセントが1%以下ならラベル表示しない
        if (data[props.index].value > 0 && props.percent !== undefined && props.percent > 0.01) {
            label = data[props.index].name+"("+ Math.round(props.percent*100) +"%)";
        }
        return (
            <text x={x} y={y} fill={FONT_COLORS[props.index % FONT_COLORS.length]} textAnchor="middle" dominantBaseline="central">
            {label}
            </text>
        );
    };
    // カスタムPie
    const renderCustomPie = (props: PieSectorShapeProps) => {
        return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
    };
    return (
        <PieChart style={{ width: '100%', maxWidth: '350px', maxHeight: '80vh', aspectRatio: 1 }} responsive>
            <Pie
            data={data}
            labelLine={false}
            label={renderCustomizedLabel}
            fill="#8884d8"
            shape={renderCustomPie}
            isAnimationActive={false}
            />
        </PieChart>
    );
}