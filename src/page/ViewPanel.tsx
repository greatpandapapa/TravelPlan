import {useState,memo} from 'react';
import { plan } from '../lib/Plan';
import {IScheduleTable} from '../typings/data_json';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useWindowSize} from '../lib/useWindowsSize';
import { Typography } from '@mui/material';
import {getBgColor} from '../component/CustomMui';
import { SlimTableCell } from '../component/CustomMui';
import { ReferenceList } from "../component/ReferenceList";
import Box from '@mui/material/Box';

type ViewPanelProps = {
  mode: string;
}

/**
 * スケジュール編集パネル
 */
function ViewPanel(gprops:ViewPanelProps) {
  const [width, height] = useWindowSize();
  let initialRows = plan.getTableRows(); 
  const [rows, setRows] = useState(initialRows);

  /**
   * スケジュールテーブル
   */
  const ScheduleTable = () => {
    let pre_date:string = "";
    return (
      <TableContainer sx={{ maxHeight: height-140 }}>
      <Table sx={{ minWidth: 650,padding: '1px 1px' }} stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <SlimTableCell align="center" component="th">No</SlimTableCell>
            <SlimTableCell align="center" component="th">日付</SlimTableCell>
            <SlimTableCell align="center" component="th">開始</SlimTableCell>
            <SlimTableCell align="center" component="th">終了</SlimTableCell>
            <SlimTableCell align="center" component="th">滞在</SlimTableCell>
            <SlimTableCell align="center" component="th">タイプ</SlimTableCell>
            <SlimTableCell align="center" component="th">予定</SlimTableCell>
            <SlimTableCell align="center" component="th">住所</SlimTableCell>
            <SlimTableCell align="center" component="th">予約</SlimTableCell>
            <SlimTableCell align="center" component="th">情報源</SlimTableCell>
            <SlimTableCell align="center" component="th">料金</SlimTableCell>
            <SlimTableCell align="center" component="th">地図</SlimTableCell>
            <SlimTableCell align="center" component="th">備考</SlimTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => { 
            const ret = (<ScheduleTableRow key={row.id} row={row} pre_date={pre_date}/>);
            pre_date = row.dayn;
            return (ret);
          })}
        </TableBody>
      </Table>
    </TableContainer>
    );
  };

  type ScheduleTableRowProps = {
    row:IScheduleTable;
    pre_date:string;
  };

  /**
   * スケジュールテーブルの行
   * 
   * @param props 
   * @returns 
   */
  const ScheduleTableRow = ((props:ScheduleTableRowProps) => {
    let bgcolor:string = props.row.no % 2 === 0 ? getBgColor('even') : getBgColor('odd');
    return (
      <TableRow key={props.row.id} style={{backgroundColor:bgcolor}}>
        <ScheduleSlimTableCells {...props} />
      </TableRow>
    );
  });

  const ScheduleSlimTableCells = ((props:ScheduleTableRowProps) => {
    return (
      <>
      <SlimTableCell align="center">{props.row.no}</SlimTableCell>
      <SlimTableCell align="left">
        {props.row.dayn != props.pre_date && <>{props.row.dayn}</>}
      </SlimTableCell>
      <SlimTableCell align="center">{props.row.start_time}</SlimTableCell>
      <SlimTableCell align="center">
        {props.row.start_time != props.row.end_time && props.row.end_time} 
      </SlimTableCell>
      <SlimTableCell align="right">{props.row.stay_minutes}</SlimTableCell>
      <SlimTableCell align="left">{props.row.type_label}</SlimTableCell>
      <SlimTableCell align="left">
        {props.row.destination.alert != "" && (<Typography sx={{color:"#FF0000"}}>★:{props.row.destination.alert}</Typography>)} 
        {props.row.name}
        {(props.row.name=="") && props.row.destination.name}
        {(props.row.name!="" && props.row.destination.name!="") && "("+props.row.destination.name+")"}
      </SlimTableCell>
      <SlimTableCell align="left">{props.row.destination.address}</SlimTableCell>
      <SlimTableCell align="center">
        <a target="_blank" href={props.row.destination.reservation_url}>{props.row.destination.reservation}</a>
      </SlimTableCell>
      <SlimTableCell align="center">
        <a target="_blank" href={props.row.destination.url}>{props.row.destination.source}</a>
      </SlimTableCell>
      <SlimTableCell align="right">
        {(props.row.destination.fee !=0) && (props.row.destination.fee + props.row.destination.currency_label)}
      </SlimTableCell>
      <SlimTableCell align="center">
        {(props.row.destination.map_url != "") && (
           <a target="_blank" href={props.row.destination.map_url}>地図</a>
          )}
      </SlimTableCell>
      <SlimTableCell align="left">{props.row.destination.memo}</SlimTableCell>
      </>
    );
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {ScheduleTable()}
    </Paper>
  );
}

export default ViewPanel;