import React from 'react';
import '../App.css';
import {API,IgetListResponse,IgetListRow} from "../lib/Api";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link,useNavigate  } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useState } from 'react';
import MyAppBar from "../component/MyAppBar";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {CPlan} from "../lib/Plan";
import { IValueOptions } from '../typings/data_json';

/**
 * ファイルからJSONデータを読み込み
 */
function LoadJsonFile() {
  let navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error('ファイルを選択して下さい')
      return
    }
  
    const file = e.target.files[0]
  
    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result
        try {
          const jsonData = JSON.parse(content as string)
          console.log(jsonData);
          navigate('/main', {state:{from:"file","data":jsonData}});
        } catch (error) {
          console.error('JSONファイルを解析できませんでした。', error)
        }
      }
    reader.readAsText(file)
  }
  
  return (
    <input type='file' accept='.json' onChange={handleFileChange} />
  );
}

/**
 * ファイルからJSONデータを読み込み
 */
function ListServerFile() {
  const [loaded,setLoaded] = React.useState<boolean>(false);
  const [rows,setRows] = React.useState<IgetListRow[]>([]);
  const [status,setStatus] = React.useState("Plan");

  if (!loaded) {
    API.getList((response)=>{
        setRows(((response as unknown) as IgetListResponse).result);
      setLoaded(true);
    });  

    return (<>loading...</>);  
  }

  function handleDelete(name:string) {
    let result = window.confirm("削除しても良いですか？");
    if (result) {
      API.deleteData(name,(response)=>{
        // データ再読み込み
        setLoaded(false);
      });  
    }
  }

  const outputRow = (row:IgetListRow) => {
    if (row.status === status || status == "all"){
        return (
            <TableRow>
              <TableCell align="left">
                <Link to={"/main"} state={{from:"server",name:row.name}}>{row.name}</Link>
              </TableCell>
              <TableCell align="left">{row.title}</TableCell>
              <TableCell align="left">{row.purpose}</TableCell>
              <TableCell align="center">{row.create_date}</TableCell>
              <TableCell align="center">{row.update_date}</TableCell>
              <TableCell align="center">{row.rev}</TableCell>
              <TableCell align="left">{CPlan.getStatusName(row.status)}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="Delete" onClick={(e:React.MouseEvent)=>{handleDelete(row.name)}}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
        );
    } else {
        return;
    }
}

  return (
   <Stack spacing={2} sx={{width: '100%'}} >
      <RadioGroup
        row
        defaultValue={status}
        name="状態"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setStatus(event.target.value);
         }}                       
      >
        <FormControlLabel value={"all"} control={<Radio />} label="全て" />
        {CPlan.getStatusValueOptions().map((option:IValueOptions) => (
          <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell component="th">名前</TableCell>
              <TableCell component="th">タイトル</TableCell>
              <TableCell component="th">目的</TableCell>
              <TableCell component="th">作成日</TableCell>
              <TableCell component="th">更新日</TableCell>
              <TableCell component="th">Rev</TableCell>
              <TableCell component="th">状態</TableCell>
              <TableCell component="th"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {rows.map((row) => (
            outputRow(row)
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

function Load() {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} fontSize={18}>
      <MyAppBar/>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2} sx={{display: 'flex',justifyContent: 'flex-start'}}>
          新規作成
        </Grid>
        <Grid item xs={10} sx={{display: 'flex',justifyContent: 'flex-start'}}>
        <Link to={"/main"} state={{from:"new"}}>テンプレート</Link>
        </Grid>
        <Grid item xs={2} sx={{display: 'flex',justifyContent: 'flex-start'}}>
          ファイルから読み込む
        </Grid>
        <Grid item xs={10} sx={{display: 'flex',justifyContent: 'flex-start'}}>
          <LoadJsonFile/>
        </Grid>
        <Grid item xs={2} sx={{display: 'flex',justifyContent: 'flex-start'}}>
          サーバから読み込む
        </Grid>
        <Grid item xs={10} sx={{display: 'flex',justifyContent: 'flex-start'}}>
          <ListServerFile/>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Load;
