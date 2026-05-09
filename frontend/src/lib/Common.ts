import {isMobile} from "react-device-detect";
import {GridColDef} from '@mui/x-data-grid';

/**
 * パッケージのインストール
 * 
 * npm install date-fns
 */

import { format } from "date-fns";

// Date型の日付をyyyy-MM-dd形式で文字列にする
export function toDateString(date:Date):string {
    return format(date,"yyyy-MM-dd");
}
// Date型の日付をyyyy-MM-dd hh:mm形式で文字列にする
export function toDateTimeString(date:Date):string {
    return format(date,"yyyy-MM-dd HH:mm");
}

// Date型のデータがInvalid Dateか確認する
export function isInvalidDate(date:Date):boolean {
    return Number.isNaN(date.getTime());
}

// カラーパレットから色を取得
//const colorindex:string[] = ["#CCFFCC","#CCFFFF","#CCCCFF","#FFCCFF","	#FFCCCC","#CCCC99","#99CC99","#99CCCC","#9999CC","#CC99CC","#CC9999"];
export const colorindex:string[] = ['#e0ffff','#f0f8ff','#e6e6fa','#ffffe0','#fff0f5','#fce1fc','#cfffd4','#afeeee'];
export function getColor(index:number):string {
    return colorindex[index % colorindex.length];
}

/**
 * 値が空文字列、NULL、undefinedならtrue
 */
export function isBlank(value:string|number|null|undefined):boolean {
    if (value === "" || value === 0 || value === null || value === undefined) {
        return true;
    } else {
        return false;
    }
}

// モバイル環境で文字を省略する場所で使う
export function cmText(text:string,text2:string=""):string {
    if (isMobile) {
        return text2;
    } else {
        return text; 
    }
}

// モバイル環境で数値を変える場所で使う
export function cmNum(num:number,num2:number=0):number {
    if (isMobile) {
        return num2;
    } else {
        return num; 
    }
}

// 日付フォーマットを返す
export function cmDateFormat():string {
    if (isMobile) {
        return "MM-DD(ddd)";
    } else {
        return "YYYY-MM-DD(ddd)";
    }
}

// モバイル環境の
export function cmBool(bln:boolean,bln2:boolean):boolean {
    if (isMobile) {
        return bln2;
    } else {
        return bln;
    }
}

// モバイル環境で表示する列を絞る
export function cmGridCol(columns:GridColDef[],mobile_fields:string[]):GridColDef[] {
  let columns2: GridColDef[] = [];
  if (isMobile) {
    columns.forEach((column:GridColDef)=>{
      if (mobile_fields.includes(column.field)) {
        columns2.push(column);
      }
    });
    return columns2;
  } else {
    return columns;
  }
}