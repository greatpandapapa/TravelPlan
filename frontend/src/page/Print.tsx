import React from 'react';
import Box from '@mui/material/Box';
import ViewPanel from './ViewPanel';
import {API,ILoadDataResponse} from "../lib/Api";
import {plan} from "../lib/Plan";
import {DataJson} from "../typings/data_json";
import { Link,useNavigate,useLocation } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

export function Print() {
  const [loaded,setLoaded] = React.useState<boolean>(false);
  const { state } = useLocation();

  if (!loaded) {
    let from:string = state["from"];
    if (from == "server") {
      let name:string = state["name"];
      API.loadData(name,(response)=>{
        plan.load(((response as unknown) as ILoadDataResponse).result.data as DataJson);
        setLoaded(true);
      });   
    }
    return (<>loading...</>);  
  }
  
  return (
        <Paper sx={{ width: '100%', overflow: 'hidden', margin: "0px" }}>
            <Grid container spacing={1}>
                <Link to={"/"}>戻る</Link>
            </Grid>
            <ViewPanel printMode></ViewPanel>
        </Paper>
    );
}
export default Print;