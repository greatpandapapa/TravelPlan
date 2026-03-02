import React, { ReactNode,useState } from 'react';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {useLocation} from "react-router-dom";
import {plan} from "../lib/Plan";
import { IScheduleTable,INote } from '../typings/data_json';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from '@mui/material';
import { SlimTableCell,AddressMapLink,ImageLink } from '../component/CustomMui';
import {CNote} from '../lib/Notes';
import TextField from '@mui/material/TextField';
import { Note } from '@mui/icons-material';
import Button from '@mui/material/Button';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import SpeedDial, { SpeedDialProps } from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import {useWindowSize} from '../lib/useWindowsSize';
import {getColor} from '../lib/Common';

type GuidePanelProps = {
}

/**
 * 旅行のしおり
 */
export function GuidePanel(props:GuidePanelProps) { 
    const days:string[] = plan.schedules.getDays(plan.deparure_date);
    const [value, setValue] = React.useState(days[0]);
    const { state } = useLocation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const tag_style = {borderRadius: '0px',minHeight: "24px", height: "24px"}

    let tabs:ReactNode[] = [];
    for(let i=0;i<days.length;i++) {
        tabs.push(<Tab key={"tab"+String(days[i])} value={days[i]} label={days[i]} sx={{...tag_style,bgcolor: getColor(i),margin:1,padding:1}} />);
    };

    let panels:ReactNode[] = [];
    for(let i=0;i<days.length;i++) {
        panels.push(
          <TabPanel key={"panel"+String(days[i])}  value={days[i]} sx={{bgcolor: getColor(i)}}>
            <Box key={"box"+String(days[i])} sx={{bgcolor: getColor(i)}}>
              <GuideTableADay key={"view"+String(days[i])} dayn={days[i]}></GuideTableADay>
            </Box>
          </TabPanel>
        );
    };

    return (
        <TabContext value={value}>
          <Box sx={{...tag_style,borderBottom: 1, borderColor: 'divider'}}>
            <TabList onChange={handleChange} key="guide" sx={{...tag_style}}>
                {tabs}
            </TabList>
            {panels}
          </Box>
        </TabContext>
    )
}

type GuideViewProps = {
    dayn:string;
}

/**
 * しおりの1日分の表示
 */
function GuideTableADay(props:GuideViewProps) {
    const rows:IScheduleTable[] = plan.getTableRowsADay(props.dayn);
    const [width, height] = useWindowSize();

    return (
      <TableContainer sx={{maxHeight: height-50}}>
      <Table sx={{ minWidth: 650,padding: '1px 1px',bgcolor:"#ffffff"}} stickyHeader aria-label="sticky table">
        <TableBody>
            {rows.map((row)=>{
               return(<GuideViewRow row={row}></GuideViewRow>);
            })}
        </TableBody>
      </Table>
      </TableContainer>
    )
}

type GuideViewRowProps = {
    row:IScheduleTable;
}

/**
 * しおりの１つの予定を表示
 */
function GuideViewRow(props:GuideViewRowProps) {
    return (
        <TableRow>
           <TableCell align="center" style={{maxWidth: 80}}>{props.row.start_time}-{props.row.end_time}</TableCell>
           <TableCell align="center" style={{maxWidth: 40}}>{props.row.stay_minutes}</TableCell>
           <TableCell align="left"><GuideViewDetail row={props.row}></GuideViewDetail></TableCell>
        </TableRow>
    );
}

/**
 * 予定の詳細表示
 */
function GuideViewDetail(props:GuideViewRowProps) {
    const sx = {paddingRight:5};
    return (
        <Box>
            <Box sx={{ display: 'flex'}}>
                <Box sx={sx}>
                    {props.row.type_label}:
                    {(props.row.name != "" && props.row.destination.name == "") && props.row.name}
                    {(props.row.name == "" && props.row.destination.name != "") && props.row.destination.name}
                    {(props.row.name != "" && props.row.destination.name != "") && props.row.name + "("+props.row.destination.name+")"}
                </Box>
                <Box sx={sx}>
                    {(props.row.destination.address != "") && (
                    <Box>住所:<AddressMapLink address={props.row.destination.address}></AddressMapLink></Box>
                    )}
                </Box>
                <Box sx={sx}>
                    {(props.row.fee !=0 && props.row.fee != null) && ("予算:"+props.row.fee.toLocaleString() + props.row.currency_label)}
                </Box>
                <Box sx={sx}>
                    {(props.row.destination.reservation_url != "") && (
                        <Box>予約:<Link target="_blank" href={props.row.destination.reservation_url}>{props.row.destination.reservation}</Link></Box>
                    )}
                </Box>
                <Box sx={sx}>
                    {(props.row.destination.url != "") && (
                        <Link target="_blank" href={props.row.destination.url}>{props.row.destination.source}</Link>
                    )}
                </Box>
                <Box sx={sx}>
                    {(props.row.destination.url2 != "") && (
                        <Link target="_blank" href={props.row.destination.url2}>参考</Link>
                    )}
                </Box>
                <Box sx={sx}>
                    {(props.row.destination.map_url != "") && (
                        <Link target="_blank" href={props.row.destination.map_url}>地図</Link>
                    )}
                </Box>
            </Box>
            <GuideNotes id={props.row.id}></GuideNotes>
        </Box>
    );
}

type GuideNotesProps = {
    id:number;
}

/**
 * 予定に付加した情報を表示
 */
function GuideNotes(props:GuideNotesProps) {
    const [notes,setNotes] = useState<CNote[]>(plan.note.getNotesByScheduleId(props.id));
   const [direction, setDirection] =
    React.useState<SpeedDialProps['direction']>('up');
  const [hidden, setHidden] = React.useState(false);


    const updateNote = (note:INote)=>{
        if (note.contents == "") {
            plan.note.delData(note.id);
        } else {
            plan.note.updateData({...note});
        }
        setNotes(plan.note.getNotesByScheduleId(props.id));
    }

    const addNote = (type:string)=>{
        const note = plan.note.getNewData();
        note.type = type;
        note.sc_id = props.id;
        note.contents = "";
        plan.note.updateData(note);
        console.log(note);
        setNotes(plan.note.getNotesByScheduleId(props.id));
    }

    const addButton = ()=>{
        <SpeedDial ariaLabel="SpeedDiale" hidden={hidden} icon={<AddIcon />}
            direction="right">
            <SpeedDialAction key="img" icon={<AddPhotoAlternateIcon/>}
                slotProps={{tooltip: {title: "Image"}}} onClick={()=>{addNote("img")}} />
            <SpeedDialAction key="img" icon={<TextIncreaseIcon/>}
                slotProps={{tooltip: {title: "Image"}}} onClick={()=>{addNote("text")}} />
        </SpeedDial>
    }

    return (
        <Box>
            {notes.map((note)=>{
                return (<GuideNote note={note} update={updateNote}></GuideNote>);
            })}
            <Box>
                <Button size="small" onClick={()=>{addNote("img")}} sx={{color:'#000000',padding:0}}>Img</Button>
                <Button size="small" onClick={()=>{addNote("text")}} sx={{color:'#000000',padding:0}}>Txt</Button>
            </Box>
        </Box>
    );
}

type GuideNoteProps = {
    note:CNote;
    update: (note:INote)=>void;
}

/**
 * 予定に付加した情報を表示
 */
function GuideNote(props:GuideNoteProps) {
    const [edit,setEdit] = useState<boolean>(props.note.contents==""?true:false);
    const [contents,setContents] = useState<string>(props.note.contents);

    const handleOnclick = (event: React.SyntheticEvent) => {
        setEdit(true);
    };

    if (edit) {
        return (
        <TextField onKeyDown={(e)=>{
            if (e.keyCode === 13) {
                props.update({...props.note,contents:contents})
                setEdit(false);
            }}}
            onChange={(e)=>{setContents(e.target.value)}}
            value={contents} sx={{width:600}}>
        </TextField>);
    } else {
        if (props.note.type == "img") {
            return <Box onDoubleClick={handleOnclick}><ImageLink url={props.note.contents}></ImageLink></Box>
        } else {
            return <Box onDoubleClick={handleOnclick}>{props.note.contents}</Box>
        }
    }
}

export default GuidePanel;