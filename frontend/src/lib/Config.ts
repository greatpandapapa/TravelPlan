import { isMobile } from "react-device-detect";
//const isMobile = true;
import pjson from "../../package.json";

export const config = {
    version: pjson.version,
    isMobile: isMobile,
    icon_hight: isMobile ? "32px":"48px",
    datagrid_rowHight: isMobile ? 25:35,
    fontsize: isMobile? 16:14
} 
