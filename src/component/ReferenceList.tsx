import {useState,ChangeEvent,ReactElement,SyntheticEvent} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { plan } from '../lib/Plan';
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar';
import { IReference } from '../typings/data_json';
import {useWindowSize} from '../lib/useWindowsSize';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { CReference } from '../lib/Reference';
import { SlimTableCell } from './CustomMui';

// Propsの型
type EditreferenceModalProps = {
    open: boolean;
    reference: CReference;
    saveData: (data:IReference) => void;
    handleClose: () => void;
}  

/**
 * 編集モーダル
 */
export function EditreferenceModal(props:EditreferenceModalProps) {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 750,
        height: 220,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 12,
        p: 2,
    };
    const [formdata,setFormData] = useState(props.reference.getData());
    // useStateで保持されているのでprops.referenceが変更されていたら更新する
    if (formdata.id !== props.reference.id) {
        setFormData(props.reference.getData());
    }

    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            >
            <Box component="form" sx={style}>
                <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                    <AppBar position="static" color="secondary">
                        URL
                    </AppBar>
                    <Grid item xs={2}>
                        サイト
                    </Grid>
                    <Grid item xs={10}>
                        <TextField id="site" name="site" size="small" sx={{width:300}} value={formdata.site}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setFormData({...formdata,site:event.target.value});
                            }}>
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        URL
                    </Grid>
                    <Grid item xs={10}>
                        <TextField id="url" name="url" size="small" sx={{width:600}} value={formdata.url}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setFormData({...formdata,url:event.target.value});
                            }}>
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        メモ
                    </Grid>
                    <Grid item xs={10}>
                        <TextField id="memo" name="memo" size="small" sx={{width:600}} value={formdata.memo} multiline rows={2}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setFormData({...formdata,memo:event.target.value});
                            }}>
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
                        <Button onClick={()=>{props.saveData(formdata)}} variant="outlined">OK</Button>
                    </Grid>
                    <Grid item xs={9}></Grid>
                </Grid>
            </Box>
        </Modal>
    );
}  

type ReferenceListProps = {
    edit:boolean
};

/**
 * 参考情報
 */
export function ReferenceList(props:ReferenceListProps) {
    const initalrows = plan.getreferenceRows();
    const [rows,setRows] = useState(initalrows);
    const [reference,setreference] = useState(new CReference());
    const [open,setOpen] = useState(false);

    // データの保存
    const saveData = (data:IReference) => {
        plan.updatereference(data);
        setRows(plan.getreferenceRows());
        setOpen(false);
    };
    // 編集
    const editData = (id:number) => {
        setreference(plan.getreference(id));
        setOpen(true);
    };
    // 編集
    const delData = (id:number) => {
        plan.delreference(id);
        console.log(plan.getreferenceRows());
        setRows(plan.getreferenceRows());
        setOpen(false);
    };

    return (
        <Box width={720} style={{padding:5,border:1,borderColor:'primary.main'}}>
            <EditreferenceModal 
                open={open}
                saveData={saveData}
                handleClose={()=>(setOpen(false))}
                reference={reference}
                /> 
            <Box fontSize={16} textAlign="left">
                参考サイト
                {props.edit && (
                <span onClick={()=>{
                    setreference(plan.getNewreference());
                    setOpen(true);
                }}>( + )</span>)}
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 600,padding: '1px 1px' }} stickyHeader aria-label="sticky table">
                    <TableHead>
                    <TableRow>
                        <SlimTableCell align="center" style={{width: '30%'}} component="th">サイト</SlimTableCell>
                        <SlimTableCell align="center" component="th">メモ</SlimTableCell>
                        {props.edit && (<SlimTableCell align="center" style={{width: '10%'}} component="th"></SlimTableCell>)}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow>
                            <SlimTableCell align="center" component="th">
                                <a target="_blank" href={row.url}>{row.site}</a>
                            </SlimTableCell>
                            <SlimTableCell align="left" component="th">{row.memo}</SlimTableCell>
                            {props.edit && (
                                    <SlimTableCell align="center" component="th">
                                    <EditIcon onClick={()=>{editData(row.id)}}/>
                                    <DeleteIcon onClick={()=>{delData(row.id)}}/>
                                </SlimTableCell>    
                            )}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ReferenceList;