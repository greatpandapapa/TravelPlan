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
const colorindex:string[] = ['#e0ffff','#f0f8ff','#e6e6fa','#ffffe0','#fff0f5','#fce1fc','#cfffd4','#afeeee'];
export function getColor(index:number):string {
    return colorindex[index % colorindex.length];
}

