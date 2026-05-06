import { ReactNode} from 'react';
import { plan,CPlan } from '../lib/Plan';
import {IFeeSummary,ITimeSummary} from '../typings/data_json';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useWindowSize} from '../lib/useWindowsSize';
import { SlimTableCell} from '../component/CustomMui';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import {MyPieChart} from '../component/MyChart';

/**
 * サマリパネル
 */
function SummaryPanel() {
    const [, height] = useWindowSize(); // widthは使ってないので省略

    const fee_summary = plan.getFeeSummary();
    let fee_data:{name:string,value:number}[] = [];
    fee_summary.forEach((fees) => {
        fee_data.push({name:fees.type_label,value:Math.round(fees.total_yen)}); 
    })
    const time_summary = plan.getTimeSummary();
    let time_data:{name:string,value:number}[] = [];
    time_summary.forEach((times) => {
        time_data.push({name:times.type_label,value:times.time}); 
    })

    /**
     * 予算テーブル
     */
    const FeeSummaryTable = () => {
        return (
            <TableContainer sx={{width:500}}>
                <Table sx={{ minWidth: 500,padding: '1px 1px' }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <SlimTableCell align="center" component="th" style={{minWidth: 50}}>種類</SlimTableCell>
                            {CPlan.currency_options.map((cc)=>{
                                return (<SlimTableCell align="center" component="th" style={{minWidth: 50}}>{cc.label}</SlimTableCell>)
                            })}
                            <SlimTableCell align="center" component="th" style={{minWidth: 50}}>総額(円)</SlimTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fee_summary.map((fees) => {
                            return (<FeeTableRow row={fees}></FeeTableRow>); 
                        })}
                    </TableBody>
                </Table>
            </TableContainer>            
        );
    };

    type FeeTableRowProps = {
        row:IFeeSummary;
    };

    const FeeTableRow = (props:FeeTableRowProps) => {
        let cells:ReactNode[] = [];
        cells.push(<SlimTableCell align="left">{props.row.type_label}</SlimTableCell>);
        cells.push(CPlan.currency_options.map((cc)=>{
            return (<SlimTableCell align="right">{Math.round(props.row.fees[cc.value]).toLocaleString()}</SlimTableCell>);
        }));
        cells.push(<SlimTableCell align="right">{Math.round(props.row.total_yen).toLocaleString()}</SlimTableCell>);
        return (<TableRow>{cells}</TableRow>);
    };

    /**
     * 予算テーブル
     */
    const TimeSummaryTable = () => {
        return (
            <TableContainer sx={{width:500}}>
                <Table sx={{ minWidth: 500,padding: '1px 1px' }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <SlimTableCell align="center" component="th" style={{minWidth: 50}}>種類</SlimTableCell>
                            <SlimTableCell align="center" component="th" style={{minWidth: 50}}>時間</SlimTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {time_summary.map((times) => {
                            return (<TimeTableRow row={times}></TimeTableRow>); 
                        })}
                    </TableBody>
                </Table>
            </TableContainer>            
        );
    };

    type TimeTableRowProps = {
        row:ITimeSummary;
    };

    const TimeTableRow = (props:TimeTableRowProps) => {
        let cells:ReactNode[] = [];
        cells.push(<SlimTableCell align="left">{props.row.type_label}</SlimTableCell>);
        cells.push(<SlimTableCell align="right">{props.row.time}</SlimTableCell>);
        return (<TableRow>{cells}</TableRow>);
    };

    let sx = {
            height: height - 140,
            width: '100%',
            marginY: "5px",
//            overflowX: 'hidden',
            overflowY: 'scroll'
        }; 

    return (
        <Box sx={sx} >
            <Box>
                <Grid container spacing={1}>
                    <Grid item xs="auto">日程：</Grid>
                    <Grid item xs={3} sx={{textAlign: "left"}}>{plan.geTerm()}</Grid>
                    <Grid item xs="auto">予算：</Grid>
                        {CPlan.currency_options.map((cc)=>{
                            if (plan.total_fee[cc.value] > 0) {
                            return (<Grid item xs={1} sx={{textAlign: "left"}}>{plan.total_fee[cc.value].toLocaleString()}{cc.label}</Grid>);
                            } else {
                            return (<></>);
                            }
                        })}
                        {(plan.total_fee["TOTAL_YEN"] > 0)? <Grid item xs={2} sx={{textAlign: "left"}}>総額:{plan.total_fee["TOTAL_YEN"].toLocaleString()}円</Grid>:""}
                </Grid>
            </Box>
            <Box>
                <Grid container spacing={1}><Grid item xs="auto">予算内訳：</Grid></Grid>
            </Box>
        	<Stack
                spacing={2}
                direction="row">
                <FeeSummaryTable/>
                <MyPieChart data={fee_data}/>
            </Stack>
            <Box>
                <Grid container spacing={1}><Grid item xs="auto">時間内訳(分)：</Grid></Grid>
            </Box>
        	<Stack
                spacing={2}
                direction="row">
                <TimeSummaryTable/>
                <MyPieChart data={time_data}/>
            </Stack>

        </Box>
    );
}

export default SummaryPanel;