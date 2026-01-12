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
    return format(date,"yyyy-MM-dd hh:mm");
}

// Date型のデータがInvalid Dateか確認する
export function isInvalidDate(date:Date):boolean {
    return Number.isNaN(date.getTime());
}