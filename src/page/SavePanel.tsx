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
    const [saved,setSaved] = useState(false);

    const saveData = () => {
        API.saveData(plan.name,plan.getSaveData(),(response)=>{
            setSaved(true);
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
                {saved && "保存しました"}
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