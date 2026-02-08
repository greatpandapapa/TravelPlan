import { isMobile } from "react-device-detect";
//const isMobile = true;

export const config = {
    version: "1.07",
    isMobile: isMobile,
    icon_hight: isMobile ? "32px":"48px",
    datagrid_rowHight: isMobile ? 25:35
} 

// モバイル環境で文字を省略する場所で使う
export function convMobileText(text:string):string {
    if (isMobile) {
        return "";
    } else {
        return text; 
    }
}