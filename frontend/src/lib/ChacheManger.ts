import {IScheduleRows,IScheduleTable} from "../typings/data_json";
import dayjs, { Dayjs } from 'dayjs';

const CC= {
    SCHEDULE_INDEX:0,
    SCHEDULE_PREINDEX:1,
    SCHEDULE_SORTEDINDEX:2,
    SCHEDULE_ROW:3,
    SCHEDULE_DAYS:4,
    SCHEDULE_TABLE:5,
}
type CC = (typeof CC)[keyof typeof CC];

export class CacheManager {
    private cache_Valid:boolean[] = [];
    private schedule_index:number[] = [];
    private schedule_preindex:number[] = [];
    private schedule_sortedindex:number[] = [];
    private schedule_rows:IScheduleRows[] = [];
    private schedule_days:string[] = [];
    private schedule_table:IScheduleTable[] = [];

    constructor() {
        this.clear();
    }

    /**
     * キャッシュを無効かする
     */
    public clear() {
        this.cache_Valid[CC.SCHEDULE_INDEX] = false;
        this.cache_Valid[CC.SCHEDULE_PREINDEX] = false;
        this.cache_Valid[CC.SCHEDULE_SORTEDINDEX] = false;
        this.cache_Valid[CC.SCHEDULE_ROW] = false;
        this.cache_Valid[CC.SCHEDULE_DAYS] = false;
        this.cache_Valid[CC.SCHEDULE_TABLE] = false;
    }

    /*****************************************************/
    /**
     * ScheuldeIndexが有効なキャッシュがあるか確認する
     */
    public hasValidScheduleIndex():boolean {
        return this.cache_Valid[CC.SCHEDULE_INDEX];
    }

    /**
     * ScheduleIndexのキャッシュを登録する
     */
    public setScheduleIndex(index:number[]) {
        this.schedule_index =  index;
        this.cache_Valid[CC.SCHEDULE_INDEX] = false;
    }

    /**
     * ScheduleIndexのキャッシュを取得する
     */
    public getScheduleIndex():number[] {
        return this.schedule_index;
    }

    /*****************************************************/
    /**
     * ScheuldePreIndexが有効なキャッシュがあるか確認する
     */
    public hasValidSchedulePreIndex():boolean {
        return this.cache_Valid[CC.SCHEDULE_PREINDEX];
    }

    /**
     * SchedulePreIndexのキャッシュを登録する
     */
    public setSchedulePreIndex(index:number[]) {
        this.schedule_preindex =  index;
        this.cache_Valid[CC.SCHEDULE_PREINDEX] = false;
    }

    /**
     * SchedulePreIndexのキャッシュを取得する
     */
    public getSchedulePreIndex():number[] {
        return this.schedule_preindex;
    }

    /*****************************************************/
    /**
     * ScheduleSortedIndexが有効なキャッシュがあるか確認する
     */
    public hasValidScheduleSortedIndex():boolean {
        return this.cache_Valid[CC.SCHEDULE_SORTEDINDEX];
    }

    /**
     * ScheduleSortedIndexのキャッシュを登録する
     */
    public setScheduleSortedIndex(index:number[]) {
        this.schedule_sortedindex =  index;
        this.cache_Valid[CC.SCHEDULE_SORTEDINDEX] = false;
    }

    /**
     * ScheduleSortedIndexのキャッシュを取得する
     */
    public getScheduleSortedIndex():number[] {
        return this.schedule_sortedindex;
    }

    /*****************************************************/
    /**
     * ScheduleRowsが有効なキャッシュがあるか確認する
     */
    public hasValidScheduleRows():boolean {
        return this.cache_Valid[CC.SCHEDULE_ROW];
    }

    /**
     * ScheduleRowsのキャッシュを登録する
     */
    public setScheduleRows(rows:IScheduleRows[]) {
        this.schedule_rows =  rows;
        this.cache_Valid[CC.SCHEDULE_ROW] = false;
    }

    /**
     * ScheduleRowsのキャッシュを取得する
     */
    public getScheduleRows():IScheduleRows[] {
        return this.schedule_rows;
    }

    /*****************************************************/
    /**
     * ScheduleRowsが有効なキャッシュがあるか確認する
     */
    public hasValidScheduleDays():boolean {
        return this.cache_Valid[CC.SCHEDULE_DAYS];
    }

    /**
     * ScheduleRowsのキャッシュを登録する
     */
    public setScheduleDays(days:string[]) {
        this.schedule_days =  days;
        this.cache_Valid[CC.SCHEDULE_DAYS] = false;
    }

    /**
     * ScheduleRowsのキャッシュを取得する
     */
    public getScheduleDays():string[] {
        return this.schedule_days;
    }

    /*****************************************************/
    /**
     * ScheduleTableが有効なキャッシュがあるか確認する
     */
    public hasValidScheduleTable():boolean {
        return this.cache_Valid[CC.SCHEDULE_TABLE];
    }

    /**
     * ScheduleTableのキャッシュを登録する
     */
    public setScheduleTable(table:IScheduleTable[]) {
        this.schedule_table =  table;
        this.cache_Valid[CC.SCHEDULE_TABLE] = false;
    }

    /**
     * ScheduleTableのキャッシュを取得する
     */
    public getScheduleTable():IScheduleTable[] {
        return this.schedule_table;
    }
}

export let cache = new CacheManager();
