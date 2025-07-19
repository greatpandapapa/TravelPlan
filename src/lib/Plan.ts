import dayjs, { Dayjs } from 'dayjs';
import {
    DataJson,
    IScheduleRows,
    IScheduleTable,
    IValueOptions,
    IScheduleNestedTable,
    IReference,
    IBringItem,
} from "../typings/data_json";
import jsondata from "./_template.json"
import ja from 'dayjs/locale/ja';
import {CScheduleList} from "./Schedule"
import {CDestinationList,CDestination} from "./Destination";
import {CReferenceList} from "./Reference";
import {CBringItemList} from "./BringItem";

// 日付の曜日を日本語にするため
dayjs.locale(ja);

/**
 * 旅行計画
 */
export class CPlan {
    // static
    static currency_options: {value:string; label:string}[] = [
            {value:"Yen",label:"円"},
            {value:"Dollar",label:"ドル"},
            {value:"Euro",label:"ユーロ"},
            {value:"Local",label:"現地通貨"}
        ];
    // プロパティ
    title: string = "";
    name: string = "";
    deparure_date: Dayjs = dayjs(jsondata.plan.deparure_date);
    members: number|null = null;
    purpose: string = "";
    // プライベート
    private schedules: CScheduleList = new CScheduleList(jsondata);
    private destinations: CDestinationList = new CDestinationList(jsondata);
    private references: CReferenceList = new CReferenceList(jsondata);
    private bringitems: CBringItemList = new CBringItemList(jsondata);
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
        this.title = data.plan.title;
        this.name = data.plan.name;
        this.deparure_date = dayjs(data.plan.deparure_date);
        this.members = data.plan.members;
        this.purpose = data.plan.purpose;

        this.schedules = new CScheduleList(data);
        this.destinations = new CDestinationList(data);
        this.references = new CReferenceList(data);
        this.bringitems = new CBringItemList(data);
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
        //  referenceは後から追加したため、サーバから返ってくるデータに含まれていない場合もあるため対応する
        let bringitem:any[];
        if (!("bringitem" in data)) {
            bringitem = [];
        } else {
            bringitem = data.bringitem;
        }
        this.bringitems = new CBringItemList({...data,bringitem:bringitem});
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
        return ([
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
        ]);
    }
    /**
     * 通貨の文字列取得
     */
    public getTypeName(key:string):string {
        return this._getOptionLabel(key,"type");
    }
    private _getOptionLabel(key:string, mode:string):string {
        let options:IValueOptions[];
        if (mode == "type") {
            options  = (this.getTypeValueOptions() as unknown[]) as IValueOptions[];
        } else if (mode == "currency") {
            options  = (this.getCurrencyValueOptions() as unknown[]) as IValueOptions[];
        } else {
            options  = (this.getAutoValueOptions() as unknown[]) as IValueOptions[];
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
    public getCurrencyValueOptions():object[] {
        return  CPlan.currency_options;
    }
    /**
     * 通貨の文字列取得
     */
    public getCurrencyName(key:string):string {
        return this._getOptionLabel(key,"currency");
    }

    /**
     * start_time_autoのValueOptions
     */
    public getAutoValueOptions():object[] {
        return ([
            {value:"",label:"なし"},
            {value:"pre",label:"前"},
            {value:"post",label:"後"}
        ]);
    }
    public getAutoName(key:string):string {
        return this._getOptionLabel(key,"start_time_auto");
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
        for(let i=0;i<rows.length;i++) {
            if (rows[i].dest_id != null) {
                if (! dest_fee_sumed.includes(rows[i].dest_id)) {
                    this.total_fee[rows[i].destination.currency] += Number(rows[i].destination.fee);
                    dest_fee_sumed.push(rows[i].dest_id);
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
        let data = {
            plan: {
                name:this.name,
                title:this.title,
                deparure_date:this.deparure_date.format("YYYY-MM-DD"),
                members: this.members,
                purpose: this.purpose
            },
            schedule: this.schedules.getSaveData(),
            destination: this.destinations.getSaveData(),
            reference: this.references.getSaveData(),
            bringitem: this.bringitems.getSaveData(),
        }
        return data;
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
     * 参考の配列
     */
    public getBringItemRows():IBringItem[] {
        return this.bringitems.getRows();
    }
    /**
     * 新規参考のObject
     */
    public getNewBringItem() {
        return this.bringitems.getNewData();
    }
    /**
     * 参考の追加
     *
     * @param data 
     */
    public updateBringItem(data:object) {
        this.bringitems.updateData(data);
    }
    /**
     * 参考を削除する
     * 
     * @param id ID
     */
    public delBringItem(id:number) {
        this.bringitems.delData(id);
    }
    /**}
     * 参考を取得する
     */
    public getBringItem(id:number) {
        return this.bringitems.getData(id);
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