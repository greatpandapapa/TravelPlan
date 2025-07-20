import React from 'react';
import '../App.css';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PlanPanel from './PlanPanel';
import {ScheduleEditPanel} from './SchedulePanel';
import ViewPanel from './ViewPanel';
import SortPanel from './SortPanel';
import SavePanel from './SavePanel';
import DestinationPanel from './DestinationPanel';
import {API,ILoadDataResponse} from "../lib/Api";
import {plan} from "../lib/Plan";
import {DataJson} from "../typings/data_json";
import {useLocation} from "react-router-dom";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import TourIcon from '@mui/icons-material/Tour';
import SaveIcon from '@mui/icons-material/Save';
import GradingIcon from '@mui/icons-material/Grading';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import MyAppBar from "../component/MyAppBar";
import BringItemPanel from './BringItemPanel';
import {config,convMobileText} from "../lib/Config"

function Main() {
  const [value, setValue] = React.useState('plan');
  const [loaded,setLoaded] = React.useState<boolean>(false);
  const { state } = useLocation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!loaded) {
    let from:string = state["from"];
    if (from == "new") {
      plan.loadTemplateData();
      setLoaded(true);
    } else if (from == "file") {
      const data = state["data"];
      plan.load((data as DataJson));
      setLoaded(true);
    } else if (from == "server") {
      let name:string = state["name"];
      API.loadData(name,(response)=>{
        plan.load(((response as unknown) as ILoadDataResponse).result.data as DataJson);
        setLoaded(true);
      });   
    }

    return (<>loading...</>);  
  }

  const tag_style = {borderRadius: '6px',minWidth:"32px",minHeight: config.icon_hight, height: config.icon_hight }

  const panel_padding:string = '5px';
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: "0px" }}>
        <MyAppBar></MyAppBar>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab icon={<CardTravelIcon />} iconPosition="start" label={convMobileText("計画")} value="plan" sx={{...tag_style, bgcolor: '#e0ffff'}} />
              <Tab icon={<CalendarMonthIcon />} iconPosition="start" label={convMobileText("工程")} value="scheduleedit"  sx={{...tag_style, bgcolor: '#f0f8ff'}}/>
              <Tab icon={<SwapVertIcon />} iconPosition="start" label={convMobileText("順序")} value="schedulesort"  sx={{...tag_style, bgcolor: '#e6e6fa'}}/>
              <Tab icon={<TourIcon />} iconPosition="start" label={convMobileText("行き先")} value="destination"  sx={{...tag_style, bgcolor: '#ffffe0'}}/>
              <Tab icon={<GradingIcon />} iconPosition="start" label={convMobileText("工程表")} value="publish"  sx={{...tag_style, bgcolor: '#fce1fc'}}/>
              <Tab icon={<HomeRepairServiceIcon />} iconPosition="start" label={convMobileText("持ち物")} value="bringitem"  sx={{...tag_style, bgcolor: '#cfffd4'}}/>
              <Tab icon={<SaveIcon />} iconPosition="start" label={convMobileText("保存")} value="save"  sx={{...tag_style, bgcolor: '#f8fbf8'}}/>
            </TabList>
          </Box>
          <TabPanel value="plan" sx={{bgcolor: '#e0ffff',padding: panel_padding,paddingTop:'20px'}}>
            <Box sx={{bgcolor: '#ffffff',margin: "0px"}}>
              <PlanPanel></PlanPanel>
            </Box>
          </TabPanel>
          <TabPanel value="scheduleedit" sx={{bgcolor: '#f0f8ff',padding: panel_padding}}>
            <Box sx={{bgcolor: '#ffffff'}}>
              <ScheduleEditPanel></ScheduleEditPanel>
            </Box>
          </TabPanel>
          <TabPanel value="schedulesort" sx={{bgcolor: '#e6e6fa',padding: panel_padding}}>
            <Box sx={{bgcolor: '#ffffff'}}>
              <SortPanel></SortPanel>
            </Box>
          </TabPanel>
          <TabPanel value="destination"  sx={{bgcolor: '#ffffe0',padding: panel_padding}}>
            <Box sx={{bgcolor: '#ffffff'}}>
              <DestinationPanel></DestinationPanel>
            </Box>
          </TabPanel>
          <TabPanel value="publish" sx={{bgcolor: '#fce1fc',padding: panel_padding}}>
            <Box sx={{bgcolor: '#ffffff'}}>
              <ViewPanel mode="view"></ViewPanel>
            </Box>
          </TabPanel>
          <TabPanel value="bringitem" sx={{bgcolor: '#cfffd4',padding: panel_padding}}>
            <Box sx={{bgcolor: '#ffffff'}}>
              <BringItemPanel></BringItemPanel>
            </Box>
          </TabPanel>
          <TabPanel value="save" sx={{bgcolor: '#f8fbf8',padding: panel_padding}}>
            <Box>
              <SavePanel></SavePanel>
            </Box>
          </TabPanel>
        </TabContext>
    </Box>
  );
}

export default Main;
