import {ChangeEvent,ReactElement} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { plan } from '../lib/Plan';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import { ISchedule } from '../typings/data_json';
import {cmNum} from '../lib/Common';

// Propsの型
type EditScheduleModalProps = {
  open: boolean;
  updateForm: (dest:ISchedule) => void;
  saveData: () => void;
  handleClose: () => void;
  schedule: ISchedule;
  children?: never[];
}

/**
 * 編集モーダル
 */
export function EditScheduleModal(props:EditScheduleModalProps) {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 620,
    width: '93%',
    height: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 12,
    p: 2,
  };

  let autoOptions:ReactElement[]=[];
  plan.getAutoValueOptions().forEach((opt)=>{
    autoOptions.push(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>);
  });

  let typeOptions:ReactElement[]=[];
  plan.getTypeValueOptions().forEach((opt)=>{
    typeOptions.push(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>);
  });

  let currencyOptions:ReactElement[]=[];
  plan.getCurrencyValueOptions().forEach((opt)=>{
    currencyOptions.push(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>);
  });
  let destinationOptions:ReactElement[]=[];
  plan.getDestinationValueOptions().forEach((opt)=>{
    destinationOptions.push(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>);
  });

  return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
      >
        <Box component="form" sx={style}>
            <Grid container spacing={0.5} justifyContent="center" alignItems="center">
              <AppBar position="static" color="secondary">
                予定
              </AppBar>
              <Grid item xs={2}>
                <TextField id="type" name="start_time_auto" label="連結" size="small" select sx={{width:'100%'}} value={props.schedule.start_time_auto}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,start_time_auto:event.target.value});
                }}>
                 {autoOptions}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField id="name" name="start_time" label="開始時間" size="small" sx={{width:'100%'}} value={props.schedule.start_time}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,start_time:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField id="name" name="tay_minutes" label="滞在時間" size="small" type="number" sx={{width:'100%'}} value={props.schedule.stay_minutes}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,stay_minutes:Number(event.target.value)});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField id="name" name="tz_ajust" label="TZ" size="small" type="number" sx={{width:'100%'}} value={props.schedule.tz_ajust}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,tz_ajust:Number(event.target.value)});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField id="type" name="type" label="タイプ" size="small" select sx={{width:'100%'}} value={props.schedule.type}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,type:event.target.value});
                }}>
                 {typeOptions}
                </TextField>
              </Grid>
              <Grid item xs={8}>
                <TextField id="name" name="name" label="名称" size="small" sx={{width:'100%'}} value={props.schedule.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,name:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField id="type" name="type" label="行先" size="small" select sx={{width:'100%'}} value={props.schedule.dest_id}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,dest_id:Number(event.target.value)});
                }}>
                 {destinationOptions}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField id="fee" name="fee" label="金額" size="small" type="number" value={props.schedule.fee}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.schedule,fee:(event.target.value as unknown)as number});
                }}
                InputProps={{inputProps: {style: { textAlign: "right" }}}}>
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField id="currency" name="currency" label="通貨" size="small" sx={{width:'100%'}}
                  value={props.schedule.currency} select
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    props.updateForm({...props.schedule,currency:event.target.value});
                  }}>
                  {currencyOptions}
                </TextField>
              </Grid>
              <Grid item xs={7}>
              </Grid>
            </Grid>
            <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
            <Button onClick={props.saveData} variant="outlined">OK</Button>
        </Box>
      </Modal>
    );
}