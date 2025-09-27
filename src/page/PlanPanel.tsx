import {useState,ChangeEvent,ReactElement,SyntheticEvent} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Dayjs } from 'dayjs';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { plan,CPlan } from '../lib/Plan';
import { ReferenceList } from "../component/ReferenceList";

/**
 * 旅行計画の編集画面
 * 
 * @returns
 */
function PlanPanel() {
    const [name,  setName]  = useState<string>(plan.name);
    const [title, setTitle] = useState<string>(plan.title);
    const [ddate, setDDate] = useState<Dayjs|null>(plan.deparure_date);
    const [members, setMembers] = useState<number|null>(plan.members);
    const [purpose, setPurpose] = useState<string>(plan.purpose);
    const [status, setStatus] = useState<string>(plan.status);
    // ステータスの選択肢
    const status_menuItems = CPlan.getStatusValueOptions().map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
    ));
    const saveData = () => {
        plan.title = title;
        if (ddate != null) {
            plan.deparure_date = ddate;
        }
        plan.members = members;
        plan.purpose = purpose;
    };

    return (
        <Box width={800}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={11}>
                    <TextField label="filename" fullWidth size="small" value={name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        plan.name = event.target.value;
                        setName(plan.name);
                      }}/>
                </Grid>
                <Grid item xs={11}>
                    <TextField label="タイトル" fullWidth size="small" value={title}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        plan.title = event.target.value;
                        setTitle(plan.title);
                      }}/>
                </Grid>
                <Grid item xs={4}>
                    <DateField label="出発日" size="small" format="YYYY-MM-DD" sx={{width:150}} value={ddate}
                    onChange={(newdate) => {
                        if (newdate != null) {
                            plan.deparure_date = newdate;
                        }
                        setDDate(plan.deparure_date);
                    }}/>
                </Grid>
                <Grid item xs={3}>
                    人数:
                    <Select value={members} sx={{width:150}} label="人数" size="small"
                      onChange={(event) => {
                            plan.members = event.target.value as number;
                            setMembers(plan.members);
                        }}>
                        {[1,2,3,4,5,6,7,8,9,10].map((no)=>(
                            <MenuItem  value={no}>{no}名</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={4}>
                    状態:
                    <Select value={status} sx={{width:150}} label="ステータス" size="small"
                      onChange={(event) => {
                            plan.status = event.target.value;
                            setStatus(plan.status);
                        }}>
                        {status_menuItems}
                    </Select>
                </Grid>
                <Grid item xs={11}>
                    <TextField label="目的" multiline rows={3} fullWidth size="small" value={purpose}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        plan.purpose = event.target.value;
                        setPurpose(plan.purpose);}}/>
                </Grid>
            </Grid>
            <ReferenceList edit={true}/>
        </Box>
    );
}

export default PlanPanel;
