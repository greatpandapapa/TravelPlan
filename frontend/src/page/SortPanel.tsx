import {useState} from 'react';
import { plan } from '../lib/Plan';
import {IScheduleTable,IScheduleNestedTable} from '../typings/data_json';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { SlimTableCell } from '../component/CustomMui';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useWindowSize} from '../lib/useWindowsSize';
import { Typography } from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  restrictToParentElement
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {getBgColor} from '../component/CustomMui';
import DragHandleIcon from "@mui/icons-material/DragHandle"
import {
  DraggableAttributes,
  DraggableSyntheticListeners
} from "@dnd-kit/core";

/**
 * スケジュール編集パネル
 */
function SortPanel() {
  const [width, height] = useWindowSize();
  let initialRows = plan.getNestedTableRows(); 
  const [rows, setRows] = useState(initialRows);

  //https://zenn.dev/koharu2739/articles/31c240c5ee5278
  // ドラッグ可能なセンサーを設定
  const sensors = useSensors(useSensor(PointerSensor),useSensor(TouchSensor));
  // ドラッグ終了時の処理
  const handleDragEnd = ((event: DragEndEvent) => {
    const { active, over } = event;
      if (over) {
//        console.log("active_id:"+active.id+",over_id:"+over.id);
        const target_id:number = Number(active.id);
        const dest_id:number = Number(over.id);
 //       console.log("target_id:"+target_id+",dest_id:"+dest_id);
        plan.moveSchedule(target_id,dest_id);
        const initialRows = plan.getNestedTableRows(); 
        setRows(initialRows);      
      }
    }
);

  /**
   * ソート機能付きスケジュールテーブル
   * 
   * @returns 
   */
  const SortableScheduleTable = ()=>(
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[
        restrictToVerticalAxis,
        restrictToWindowEdges,
        restrictToParentElement
      ]}
    >
      <SortableContext
        items={rows.map((row) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        {ScheduleTable()}
      </SortableContext>
    </DndContext>
  );

  /**
   * スケジュールテーブル
   * 
   * SortableContextを二重化している。
   * グループごとと、グループ内の二重
   */
  const ScheduleTable = () => (
    <TableContainer sx={{ maxHeight: height-140 }}>
      <Table sx={{ minWidth: 650,padding: '1px 1px' }} stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <SlimTableCell component="th"></SlimTableCell>
            <SlimTableCell component="th">ID</SlimTableCell>
            <SlimTableCell component="th">日付</SlimTableCell>
            <SlimTableCell component="th">時間</SlimTableCell>
            <SlimTableCell component="th">滞在</SlimTableCell>
            <SlimTableCell component="th">タイプ</SlimTableCell>
            <SlimTableCell component="th">予定</SlimTableCell>
            <SlimTableCell component="th">住所</SlimTableCell>
            <SlimTableCell component="th">予約</SlimTableCell>
            <SlimTableCell component="th">情報源</SlimTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <SortableContext items={rows.map((grp_rows)=>grp_rows.head_id)}>
            {rows.map((grp_rows) => (
                <DraggableScheduleTableRow key={grp_rows.head_id} grp_rows={grp_rows}/>
            ))}
            </SortableContext>
        </TableBody>
      </Table>
    </TableContainer>
  );

  type ScheduleTableRowProps = {
    grp_rows:IScheduleNestedTable
  };

  /**
   * スケジュールテーブルの行（グループ）
   * 
   * 上位のIDと、下位のSortableContextのIDが重複しないようにScheduleのIDをIDにしている
   */
  const DraggableScheduleTableRow = ((props:ScheduleTableRowProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: props.grp_rows.head_id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };
    const style2 = {...style,backgroundColor:props.grp_rows.id % 2 === 0 ? getBgColor('even') : getBgColor('odd')};

    // 先頭の１行
    const top_row = props.grp_rows.rows[0];
    const other_rows = props.grp_rows.rows.slice(1, props.grp_rows.rows.length);
    if (top_row === undefined) {
      throw new Error("DraggableScheduleTableRow: rows is branck array.");
    }

    return (
      <>
        <TableRow key={top_row.id} ref={setNodeRef} style={style2} {...attributes} >
            <ScheduleSlimTableCells listeners={listeners} row={top_row}  grp_head={true} grp_count={props.grp_rows.count}/>
        </TableRow>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToWindowEdges,
            restrictToParentElement
          ]}
        >
          <SortableContext items={other_rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
            {other_rows.map((row) => (
              <DraggableScheduleTableRowOther grp_id={props.grp_rows.id} row={row}/>
            ))}
          </SortableContext>
        </DndContext>
      </>
    );
  });

  interface ScheduleTableRowOtherProps {
    grp_id: number;
    row:IScheduleTable;
  };

  /**
   * 各グループの先頭以外の行
   * 
   * 各グループのSortableContextを配置し、グループ内のソートを実現
   */
  const DraggableScheduleTableRowOther = ((props:ScheduleTableRowOtherProps) => {
    const local_key = props.row.id
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: local_key });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };
    const style2 = {...style,backgroundColor:props.grp_id % 2 === 0 ? getBgColor('even') : getBgColor('odd')};

    return (
        <TableRow key={props.row.id} ref={setNodeRef} style={style2} {...attributes} {...listeners}>
            <ScheduleSlimTableCells listeners={listeners} row={props.row} grp_head={false} grp_count={1} />
        </TableRow>
    );
  });

  interface  ScheduleSlimTableCellsProps {
    row:IScheduleTable;
    listeners:DraggableSyntheticListeners;
    grp_head: boolean;
    grp_count: number;
  };

  /**
   * １行の全セルを出力
   */
  const ScheduleSlimTableCells = ((props:ScheduleSlimTableCellsProps) => {
    return (
      <>
        {props.grp_head == true ? (
         <SlimTableCell rowSpan={props.grp_count} style={{verticalAlign:'top'}}>
            <DragHandleIcon {...props.listeners}/>
          </SlimTableCell>
         ):<></>}
        <SlimTableCell align="center">{props.row.id}</SlimTableCell>
        <SlimTableCell align="left">{props.row.dayn}</SlimTableCell>
        <SlimTableCell align="center">{props.row.start_time}-{props.row.end_time}</SlimTableCell>
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
      </>
    );
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginY: "10px" }}>
       {SortableScheduleTable()}
    </Paper>
  );
}

export default SortPanel;