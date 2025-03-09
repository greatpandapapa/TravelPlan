import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate,useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import {config} from "../lib/Config";

export function MyAppBar() {
    const navigate = useNavigate();
    const location = useLocation();

    function onClickAppBaButton() {
      let result = true;
      if (location.pathname != "/") {
        result = window.confirm("変更を破棄し、ロード画面に戻っても良いですか？");
      }
      if (result) {
        navigate('/')
      }
    }
    
    return (
      <AppBar position="static" sx={{margin:0,padding:0}}>
      <Toolbar>
        <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onClickAppBaButton}
          >
            <MenuIcon />
          </IconButton>
        旅行計画 <Box fontSize={12} sx={{ paddingLeft: 1 }}>  - make your happy travel - Ver.{config.version}</Box>
      </Toolbar>
    </AppBar>
  );
}
export default MyAppBar;