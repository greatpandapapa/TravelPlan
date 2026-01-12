import dayjs, { Dayjs } from 'dayjs';
import {
    DataJson,
    IScheduleRows,
    IScheduleTable,
    IValueOptions,
    IScheduleNestedTable,
    IReference,
    IBringItem,
    IActionItem,
    IPlan,
} from "../typings/data_json";
import jsondata from "./_template.json"
import ja from 'dayjs/locale/ja';
import {CScheduleList} from "./Schedule"
import {CDestinationList,CDestination} from "./Destination";
import {CReferenceList} from "./Reference";
import {CBringItemList} from "./BringItem";
import {CActionItemList} from "./ActionItem";
import {toDateString,toDateTimeString} from "./Common";

// 日付の曜日を日本語にするため
dayjs.locale(ja);

/**
 * 旅行計画
 */
export class CPlan {
    // static
    static currency_options: IValueOptions[] = [
            {value:"Yen",label:"円"},
            {value:"Dollar",label:"ドル"},
            {value:"Euro",label:"ユーロ"},
            {value:"Local",label:"現地通貨"}
        ];
    static status_options: IValueOptions[] = [
            {value:"Plan",label:"計画中"},
            {value:"Done",label:"済み"},
            {value:"Sleep",label:"保留"},
            {value:"Rejected",label:"ボツ"},
        ];
    static type_options: IValueOptions[] = [
            {label:"観光",value:"sightseeing"}, 
            {label:"食事",value:"meal"}, 
            {label:"移動",value:'move'},
            {label:"宿泊施設",value:'hotel'},
            {label:"個人宅",value:'home'},
            {label:"駐車場",value:'parking'},
            {label:"駅",value:'station'},
            {label:"空港",value:'airport'},
            {label:"港",value:'port'},
            {label:"行動",value:'action'},
            {label:"手続き",value:'procedure'},
            {label:"サービス",value:'service'},
            {label:"終了",value:'end'}
        ];
    static auto_options: IValueOptions[] = [
            {value:"",label:"なし"},
            {value:"pre",label:"前"},
            {value:"post",label:"後"}
        ];

    // プロパティ
    title: string = "";
    name: string = "";
    deparure_date: Dayjs = dayjs(jsondata.plan.deparure_date);
    members: number|null = null;
    purpose: string = "";
    status: string = CPlan.status_options[0].value;
    create_date: string = toDateString(new Date());
    update_date: string = toDateString(new Date());
    rev: number = 0;
    usd_rate: number = 150;
    eur_rate: number = 180;
    local_rate: number = 1;
    local_currency_name = "";
    // プライベート
    private schedules: CScheduleList = new CScheduleList(jsondata);
    private destinations: CDestinationList = new CDestinationList(jsondata);
    private references: CReferenceList = new CReferenceList(jsondata);
    private bringitems: CBringItemList = new CBringItemList(jsondata);
    private actionitems: CActionItemList = new CActionItemList(jsondata);
    // 集計情報
    public start_date: String="";
    public end_date: String="";
    public total_fee: {[index: string]: number} = {}

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor() {
    }

    /**
     * テンプレートを読み込む
     */
    public loadTemplateData() {
        const data = jsondata;
        // 日付を今日の日付にする
        data.plan.create_date = toDateTimeString(new Date());
        data.plan.update_date = toDateTimeString(new Date());

        this.title = data.plan.title;
        this.name = data.plan.name;
        this.deparure_date = dayjs(data.plan.deparure_date);
        this.members = data.plan.members;
        this.purpose = data.plan.purpose;
        this.status = data.plan.status;
        this.create_date = data.plan.create_date;
        this.update_date = data.plan.update_date;
        this.rev = data.plan.rev;
        this.usd_rate = data.plan.usd_rate;
        this.eur_rate = data.plan.eur_rate;
        this.local_rate = data.plan.local_rate;
        this.local_currency_name = data.plan.local_currency_name;

        this.schedules = new CScheduleList(data);
        this.destinations = new CDestinationList(data);
        this.references = new CReferenceList(data);
        this.bringitems = new CBringItemList(data);
        this.actionitems = new CActionItemList(data);

        this._setLocalCurrencyName();
    }

    // 現地通貨の選択肢名を設定
    private _setLocalCurrencyName():void {
        CPlan.currency_options[3].label = this.local_currency_name;
    }

    /**
     * データのロード
     * 
     * @param name 保存ファイル名
     * @param data JSONデータ
     */
    public load(data: DataJson) {
        this.title = data.plan.title;
        this.name = data.plan.name;
        this.deparure_date = dayjs(data.plan.deparure_date);
        this.members = data.plan.members;
        this.purpose = data.plan.purpose;

        this.schedules = new CScheduleList(data);
        this.destinations = new CDestinationList(data);
        //  referenceは後から追加したため、サーバから返ってくるデータに含まれていない場合もあるため対応する
        let reference:any[];
        if (!("reference" in data)) {
            reference = [];
        } else {
            reference = data.reference;
        }
        this.references = new CReferenceList({...data,reference:reference});
        //  bringitemは後から追加したため、サーバから返ってくるデータに含まれていない場合もあるため対応する
        let bringitem:any[];
        if (!("bringitem" in data)) {
            bringitem = [];
        } else {
            bringitem = data.bringitem;
        }
        this.bringitems = new CBringItemList({...data,bringitem:bringitem});
        //  actionは後から追加したため、サーバから返ってくるデータに含まれていない場合もあるため対応する
        let actionitem:any[];
        if (!("actionitem" in data)) {
            actionitem = [];
        } else {
            actionitem = data.actionitem;
        }
        this.actionitems = new CActionItemList({...data,actionitem:actionitem});
        // statusはあとから追加したため無い場合は初期値を設定
        if (!("status" in data)) {
            this.status = CPlan.status_options[0].value;
        } else {
            this.status = data.plan.status;
        }
        // create_date,update_date,revは後から追加したので無かった場合の対応
        if (data.plan.create_date === undefined) {
            this.create_date = toDateString(new Date());
        } else {
            this.create_date = data.plan.create_date;
        }
        if (data.plan.update_date === undefined) {
            this.update_date = toDateString(new Date());
        } else {
            this.update_date = data.plan.update_date;
        }
        if (data.plan.rev === undefined) {
            this.rev = 0;
        } else {
            this.rev = data.plan.rev;
        }
        // usd_rate,eur_rate,local_rateは後から追加したので無かった場合の対応
        if (data.plan.usd_rate === undefined) {
            this.usd_rate = 150;
        } else {
            this.usd_rate = data.plan.usd_rate;
        }
        if (data.plan.eur_rate === undefined) {
            this.eur_rate = 180;
        } else {
            this.eur_rate = data.plan.eur_rate;
        }
        if (data.plan.local_rate === undefined) {
            this.local_rate = 1;
        } else {
            this.local_rate = data.plan.local_rate;
        }
        // 現地通貨名を指定
        if (data.plan.local_currency_name === undefined) {
            this.local_currency_name = "現地通貨";
        } else {
            this.local_currency_name = data.plan.local_currency_name;
        }     

        this._setLocalCurrencyName();
    }

    /**
     * SchedulePanelを表示するための配列を取得する
     */
    public getScheduleRows():IScheduleRows[] {
        return this.schedules.getScheduleRows(this.deparure_date);
    }

    /**
     * 新規スケジュールのObject
     * 
     * @param id IDの下に追加する
     */
    public addSchedule(id:number):number {
        return this.schedules.addSchedule(id);
    }
    /**
     * スケジュールの追加
     *
     * @param data 
     */
    public updateSchedule(data:object) {
        this.schedules.updateSchedule(data);
    }
    /**
     * スケジュールを削除する
     * 
     * @param id ID
     */
    public delSchedule(id:number) {
        this.schedules.delSchedule(id);
    }
    /**
     * pre_idのvaliueOptionsを取得
     */
    public getSchedulePreIdValiueOptions():number[] {
        return this.schedules.getPreIdValiueOptions();
    }

    /**
     * 新規目的用のObject
     */
    public getDestinationRows():object[] {
        return this.destinations.getRows();
    }
    /**
     * 新規目的地用のObject
     */
    public getNewDestination():CDestination {
        return this.destinations.getNewData();
    }

    /**
     * SelectのValueOptionを出力する
     */
    public getDestinationValueOptions():Object[] {
        return this.destinations.getDestinationValueOptions();
    }
    /**
     * 目的の追加
     *
     * @param data 
     */
    public updateDestination(data:object) {
        this.destinations.updateData(data);
    }
    /**
     * 目的を削除する
     * 
     * @param id ID
     */
    public delDestination(id:number) {
        this.destinations.delData(id);
    }
    /**}
     * 目的地を取得する
     */
    public getDestination(id:number) {
        return this.destinations.getData(id);
    }

    /**
     * typeのValueOptions
     */
    public getTypeValueOptions():IValueOptions[] {
        return CPlan.type_options;
    }
    /**
     * 通貨の文字列取得
     */
    public getTypeName(key:string):string {
        return CPlan.getOptionLabel(key,"type");
    }
    /**
     * 
     */
    public static getOptionLabel(key:string, mode:string):string {
        let options:IValueOptions[];
        if (mode == "type") {
            options  = (CPlan.type_options as unknown[]) as IValueOptions[];
        } else if (mode == "currency") {
            options  = (CPlan.currency_options as unknown[]) as IValueOptions[];
        } else if (mode == "start_time_auto") {
            options  = (CPlan.auto_options as unknown[]) as IValueOptions[];
        } else {
            options  = (CPlan.status_options as unknown[]) as IValueOptions[];
        }
        for (let row of options) {
            if (row.value == key) {
                return row.label;
            }
        }
        return "";
    }

    /**
     * currencyのValueOptions
     */
    public getCurrencyValueOptions():IValueOptions[] {
        return  CPlan.currency_options;
    }

    /**
     * 通貨の文字列取得
     */
    public getCurrencyName(key:string):string {
        return CPlan.getOptionLabel(key,"currency");
    }

    /**
     * currencyのValueOptions
     */
    public static getStatusValueOptions():IValueOptions[] {
        return  CPlan.status_options;
    }
    /**
     * 上智の文字列取得
     */
    public static getStatusName(key:string):string {
        return CPlan.getOptionLabel(key,"status");
    }

    /**
     * start_time_autoのValueOptions
     */
    public getAutoValueOptions():IValueOptions[] {
        return CPlan.auto_options;
    }
    public getAutoName(key:string):string {
        return CPlan.getOptionLabel(key,"start_time_auto");
    }

    /**
     * テーブル出力用のObjectを作る
     */
    public getTableRows():IScheduleTable[] {
        let rows: IScheduleTable[] = [];
        let sc: IScheduleTable;
        this.getScheduleRows().map((row)=>{
            sc = {...row,
                  destination: this.destinations.getNewTableRow(),
                  type_label: this.getTypeName(row.type),
                  start_time_auto_label: this.getAutoName(row.start_time_auto)};
            if (row.dest_id != null) {
                sc.destination = {...this.destinations.getDestinationTableRow(row.dest_id)};
                sc.destination.currency_label = this.getCurrencyName(sc.destination.currency);
            }
            rows.push(sc);
        });
        this.start_date = rows[0].dayn;
        this.end_date = rows[rows.length-1].dayn;
        let filter = new TableFilter(rows);

        let dest_fee_sumed:(number|null)[] = [];
        // 金額計算（毎回クリアする）
        CPlan.currency_options.forEach((cc)=>{
            this.total_fee[cc.value] = 0;
        });
        this.total_fee["TOTAL_YEN"] = 0;
        for(let i=0;i<rows.length;i++) {
            if (rows[i].dest_id != null) {
                if (! dest_fee_sumed.includes(rows[i].dest_id)) {
                    // 個別なら人数分をかける
                    if (rows[i].destination.pay == "Every" && plan.members !== null) {
                        rows[i].destination.fee = rows[i].destination.fee * plan.members;
                    }
                    let fee = Number(rows[i].destination.fee);
                    this.total_fee[rows[i].destination.currency] += fee;
                    // 総額の加算
                    if (rows[i].destination.currency == "Yen") {
                        this.total_fee["TOTAL_YEN"] += fee;
                    } else if (rows[i].destination.currency == "Dollar") {
                        this.total_fee["TOTAL_YEN"] += fee * this.usd_rate;
                    } else if (rows[i].destination.currency == "Euro") {
                        this.total_fee["TOTAL_YEN"] += fee * this.eur_rate;
                    } else if (rows[i].destination.currency == "Local") {
                        this.total_fee["TOTAL_YEN"] += fee * this.local_rate;
                    }
                    dest_fee_sumed.push(rows[i].dest_id);
                } else {
                    rows[i].destination.fee = 0;
                }
            }
        }

        return filter.do();
    }

    /**
     * 期間を取得する
     */
    public geTerm():String {
        return this.start_date + "-" + this.end_date; 
    }

    /**
     * テーブル出力用のObjectを作る
     */
    public getNestedTableRows():IScheduleNestedTable[] {
        let nrows:IScheduleNestedTable[] = [];
        const rows:IScheduleTable[] = this.getTableRows();
        // グループの個数を数える
        let pre_grp_id:number = rows[0].grp_id;
        let grp_count:number = 0;
        let grp_head_id:number =  rows[0].id;
        let grp_rows:IScheduleTable[] = [];
        for(let i = 0; i < rows.length; i++) {
            if (pre_grp_id != rows[i].grp_id) {
                nrows.push({id:pre_grp_id, count:grp_count, head_id:grp_head_id, rows:grp_rows});
                grp_rows = [];
                grp_rows.push(rows[i]);
                pre_grp_id = rows[i].grp_id;
                grp_head_id = rows[i].id;
                grp_count = 1;
            } else {
                grp_rows.push(rows[i]);
                grp_count++;
            }
        }
        nrows.push({id:pre_grp_id, count:grp_count, head_id:grp_head_id, rows:grp_rows});
        return nrows;
    }

    /**
     * スケジュールの移動
     */
    public moveSchedule(target_id:number,dest_id:number) {
        this.schedules.moveSchedule(target_id,dest_id);
    }

    /**
     * セーブデータの作成
     */
    public getSaveData():object {
        this.update_date = toDateTimeString(new Date());
        let data = {
            plan: {
                name:this.name,
                title:this.title,
                deparure_date:this.deparure_date.format("YYYY-MM-DD"),
                members: this.members,
                purpose: this.purpose,
                status: this.status,
                create_date: this.create_date,
                update_date: this.update_date,
                rev: this.rev,
                usd_rate: this.usd_rate,
                eur_rate: this.eur_rate,
                local_rate: this.local_rate,
                local_currency_name: this.local_currency_name,
            },
            schedule: this.schedules.getSaveData(),
            destination: this.destinations.getSaveData(),
            reference: this.references.getSaveData(),
            bringitem: this.bringitems.getSaveData(),
            actionitem: this.actionitems.getSaveData(),
        }
        return data;
    }
    
    /**
     * Revを上げる
     */
    public incRev() {
        this.rev++;
    }

    /**
     * 参考の配列
     */
    public getReferenceRows():IReference[] {
        return this.references.getRows();
    }
    /**
     * 新規参考のObject
     */
    public getNewReference() {
        return this.references.getNewData();
    }
    /**
     * 参考の追加
     *
     * @param data 
     */
    public updateReference(data:object) {
        this.references.updateData(data);
    }
    /**
     * 参考を削除する
     * 
     * @param id ID
     */
    public delReference(id:number) {
        this.references.delData(id);
    }
    /**}
     * 参考を取得する
     */
    public getReference(id:number) {
        return this.references.getData(id);
    }

    /**
     * 持ち物の配列
     */
    public getBringItemRows():IBringItem[] {
        return this.bringitems.getRows();
    }
    /**
     * 新規持ち物のObject
     */
    public getNewBringItem() {
        return this.bringitems.getNewData();
    }
    /**
     * 持ち物の追加
     *
     * @param data 
     */
    public updateBringItem(data:object) {
        this.bringitems.updateData(data);
    }
    /**
     * 持ち物を削除する
     * 
     * @param id ID
     */
    public delBringItem(id:number) {
        this.bringitems.delData(id);
    }
    /**}
     * 持ち物を取得する
     */
    public getBringItem(id:number) {
        return this.bringitems.getData(id);
    }
    /**
     * 持ち物タイプの選択肢
     */
    public getBringItemTypeValueOptions():IValueOptions[] {
        return this.bringitems.getTypeValueOptions();
    }        

    /**
     * アクションアイテムの配列取得
     */
    public getActionItemRows():IActionItem[] {
        return this.actionitems.getRows();
    }
    /**
     * 新規アクションアイテムのObject
     */
    public getNewActionItem() {
        return this.actionitems.getNewData();
    }
    /**
     * アクションアイテムの追加
     *
     * @param data 
     */
    public updateActionItem(data:object) {
        this.actionitems.updateData(data);
    }
    /**
     * アクションアイテムを削除する
     * 
     * @param id ID
     */
    public delActionItem(id:number) {
        this.actionitems.delData(id);
    }
    /**}
     * アクションアイテムを取得する
     */
    public getActionItem(id:number) {
        return this.actionitems.getData(id);
    }
    /**
     * アクションアイテムタイプの選択肢
     */
    public getActionItemTypeValueOptions():IValueOptions[] {
        return this.actionitems.getTypeValueOptions();
    }        
}

/**
 * テーブル表示用データのフィルタ・コンバータ
 */
class TableFilter {
    rows:IScheduleTable[];

    // コンストラクタ
    constructor(rows:IScheduleTable[]) {
        this.rows = rows;
    }

    /**
     * フィルタ
     */
    do() {
        this._addRouteSearchLink();
        this._checkHoliday();
//        this._addMapLink();
        return this.rows;
    }

    /**
     * GoogleMapのリンクをつける
     * 
     */
    private _addRouteSearchLink() {
        // 最初と最後は見る必要ないのでループから外す
        for(let i=1;i<this.rows.length-1;i++) {
            if (this.rows[i].type == "move" ) {
                if (i-1 < 0 || i+1 >= this.rows.length) {
                    continue;
                }
                const re = new RegExp('(.+)駅\\s*→\\s*(.+)駅\\s*');
                if (re.test(this.rows[i].name)) {
                    // 駅名
                    const matches = this.rows[i].name.match(re);
                    if (matches != null) {
                        const from = matches[1].trim();
                        const to = matches[2].trim();
                        this._createYahooTrainURL(i,from,to);
                    }
                } else if (this.rows[i-1].type == "station"  && this.rows[i+1].type == "station") {
                    // 駅名
                    const from = this.rows[i-1].name;
                    const to = this.rows[i+1].name;
                    this._createYahooTrainURL(i,from,to);
                } else if (this.rows[i-1].destination.address != ""  && this.rows[i+1].destination.address != "") {
                    // GoogleMap
                    let from = this.rows[i-1].destination.address;
                    let to = this.rows[i+1].destination.address;
                    this._createGoogleMapURL(i,from,to);
                }
            }
        }
    }

    /**
     * Yahoo経理案内のURLを生成する
     * 
     * @param index this.rowsのインデックス
     * @param from 出発駅名
     * @param to 到着駅名
     */
    private _createYahooTrainURL(index:number,from:string,to:string) {
        // Yahoo経路検索
        //https://transit.yahoo.co.jp/search/result?from=%E6%B4%8B%E5%85%89%E5%8F%B0&to=%E6%9D%B1%E4%BA%AC&fromgid=&togid=&flatlon=&tlatlon=&via=&viacode=&y=2025&m=02&d=23&hh=07&m1=0&m2=0&type=1&ticket=ic&expkind=1&userpass=1&ws=3&s=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1
        // 駅名
        const org = encodeURIComponent(from);
        const dest = encodeURIComponent(to);
        // 日付
        const day = /(\d+)\-(\d+)\-(\d+)/.exec(this.rows[index].dayn);
        if (day == null) return;
        const y:string = day[1];
        const m:string = day[2];  // 0パディングする必要あるがもともとなってるから
        const d:string = day[3];  // 0パディングする必要あるがもともとなってるから
        // 時間
        const st:(string|null) = this.rows[index].start_time;
        if (st == null) return;
        const time = /(\d+)\:(\d)(\d)/.exec(st);
        if (time == null) return;
        const hh:string = ('00'+Number(time[1])).slice(-2); // 0パディングする必要あり
        const m1:string = time[2];
        const m2:string = time[3];
        const url = "https://transit.yahoo.co.jp/search/result?from="+org+"&to="+dest+"&fromgid=&togid=&flatlon=&tlatlon=&via=&viacode=&y="+y+"&m="+m+"&d="+d+"&hh="+hh+"&m1="+m1+"&m2="+m2+"&type=1&ticket=ic&expkind=1&userpass=1&ws=3&s=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1"
        this.rows[index].destination.url = url;
        this.rows[index].destination.source = "Y!経路検索";
    }

    /**
     * Yahoo経理案内のURLを生成する
     * 
     * @param index this.rowsのインデックス
     * @param from 出発駅名
     * @param to 到着駅名
     */
    private _createGoogleMapURL(index:number,from:string,to:string) {
        // GoogleMap
        let org = encodeURIComponent(from);
        let dest = encodeURIComponent(to);
        let url = "https://www.google.com/maps/dir/?api=1&origin="+org+"&destination="+dest;
        this.rows[index].destination.url = url;
        this.rows[index].destination.source = "GoogleMap";
    }

    /**
     * 定休日をチェックする
     */
    private _checkHoliday() {
        for(let i=0;i<this.rows.length;i++) {
            let wday = /\((.+)\)/.exec(this.rows[i].dayn);
            if (wday != null) {
                if ((wday[1] == "月" && this.rows[i].destination.hd_mon) ||
                    (wday[1] == "火" && this.rows[i].destination.hd_tue) ||
                    (wday[1] == "水" && this.rows[i].destination.hd_wed) ||
                    (wday[1] == "木" && this.rows[i].destination.hd_thu) ||
                    (wday[1] == "金" && this.rows[i].destination.hd_fri) ||
                    (wday[1] == "土" && this.rows[i].destination.hd_sat) ||
                    (wday[1] == "日" && this.rows[i].destination.hd_sun)) {
                    this.rows[i].destination.alert = "定休日";
                }
            }
        }
    }

    /**
     * GoogleMapのリンクをつける
     * 
     */
    private _addMapLink() {
        // 最初と最後は見る必要ないのでループから外す
        for(let i=1;i<this.rows.length-1;i++) {
            if (this.rows[i].destination.address != "") {
                let address = encodeURIComponent(this.rows[i].destination.address);
                let url = "https://www.google.com/maps/place/"+address;
                this.rows[i].destination.map_url = url;
            }
        }
    }
}

export let plan = new CPlan();