import {useState} from 'react';
import { plan } from '../lib/Plan';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {API} from "../lib/Api";
import Typography from '@mui/material/Typography';

/**
 * スケジュール編集パネル
 */
function SavePanel() {
    const [saved,setSaved] = useState<string>("");
    const [resp_mesg,setRespMesg] = useState<string>("");

    const saveData = () => {
        API.saveData(plan.name,plan.getSaveData(),(response)=>{
            // 成功の場合
            if (response.code == 0) {
                plan.incRev();
                setSaved("success");
            } else {
                setSaved("error");
                setRespMesg(response.result.mesg);
            }
        });      
    };

    // ダウンロード
    const filename = plan.name + `.json`;
    const blobData = new Blob([JSON.stringify(plan.getSaveData())], {
      type: 'text/json',
    })
    const jsonURL = URL.createObjectURL(blobData)
    
    const ExportLink = () => {
        return (<a href={jsonURL} download={filename}>JSONファイルをDownload</a>);
    }
 
    return (
    <Grid container>
        <Typography>
            <Box>
            <Box sx={{ p: 2, display: 'flex',justifyContent: 'flex-start',verticalAlign:'center' }}>
                サーバに保存しますか？<Button variant="outlined" size="small" onClick={saveData} sx={{bgcolor: '#ffffff'}}>はい</Button>
                {saved == "success" && "保存しました"}
                {saved == "error" && resp_mesg}
            </Box>
            <Box sx={{ p: 2, display: 'flex',justifyContent: 'flex-start' }}>
              <ExportLink/>
            </Box>
            </Box>
        </Typography>
    </Grid>
  );
}

export default SavePanel;