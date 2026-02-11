import dayjs, { Dayjs } from 'dayjs';
import {
    DataJson,
    IDestination,
    IDestinationTable,
    IScheduleNestedTable,
} from "../typings/data_json";
import {
    CBaseListItem,
    CBaseList
} from "./BaseList";

/**
 * 目的
 */
export class CDestinationList extends CBaseList<CDestination> {
    list: CDestination[] = [];

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data: DataJson) {
        super();
         for (let dt of data.destination) {
            this.list.push(this._factoryObject(dt));
        }
    }

    /**
     * 空オブジェクトの生成（継承先でオーバーライトする）
     */
    protected override _factoryObject(data:IDestination):CDestination {
        return new CDestination(data);
    }

    /**
     * 新規データを生成する
     */
    public getNewTableRow():IDestinationTable {
        return {...new CDestination(),alert:""};
    }

    /**
     * SelectのValueOptionを生成する
     * 
     * @returns 
     */
    public getDestinationValueOptions() {
        let options = [];
        options.push({value:null,label:""});
        for (let dt of this.list) {
            options.push({value:dt.id,label:dt.name});
        }
        return options;
    }

    /**
     * テーブル出力用のデータを生成する
     * 
     * @param id 
     * @returns 
     */
    public  getDestinationTableRow(id:number):IDestinationTable {
        let dt:CDestination = this.getData(id);
        let row:IDestinationTable = {...dt,alert:""};
        return row;
    }
}

/**
 * 目的
 */
export class CDestination extends CBaseListItem implements IDestination {
    // プロパティ
    type: string = "";
    name: string = "";
    address: string = "";
    tel_number: string = "";
    reservation: string = "";
    reservation_site: string = "";
    reservation_url: string = "";
    fee: number = 0;
    currency: string = "";
    pay: string = "total";
    source: string = "";
    url: string = "";
    url2: string = "";
    map_url: string = "";
    memo: string = "";
    hd_sun: boolean = false;
    hd_mon: boolean = false;
    hd_tue: boolean = false;
    hd_wed: boolean = false;
    hd_thu: boolean = false;
    hd_fri: boolean = false;
    hd_sat: boolean = false;

    constructor(data?: IDestination) {
        // 最初にsuperを呼んでおく必要あり
        super({id:0});
        if (data != undefined) {
            this.id = data.id;
            this.type = data.type;
            this.name = data.name;
            this.address = data.address;
            this.tel_number = data.tel_number;
            this.reservation = data.reservation;
            this.reservation_site = data.reservation_site;
            this.reservation_url = data.reservation_url;
            this.fee = data.fee;
            this.currency = data.currency
            this.pay = data.pay;
            this.source = data.source;
            this.url = data.url;
            this.url2 = data.url2;
            this.map_url = data.map_url;
            this.memo = data.memo;
            this.hd_sun = data.hd_sun;
            this.hd_mon = data.hd_mon;
            this.hd_tue = data.hd_tue;
            this.hd_wed = data.hd_wed;
            this.hd_thu = data.hd_thu;
            this.hd_fri = data.hd_fri;
            this.hd_sat = data.hd_sat;
            this._fixUndefField();
        }
        if (this.fee === undefined) {
            this.fee = 0;
        }
    }

    update(data: IDestination) {
        this.type = data.type;
        this.name = data.name;
        this.address = data.address;
        this.tel_number = data.tel_number;
        this.reservation = data.reservation;
        this.reservation_site = data.reservation_site;
        this.reservation_url = data.reservation_url;
        this.fee = data.fee;
        this.currency = data.currency
        this.pay = data.pay;
        this.source = data.source;
        this.url = data.url;
        this.url2 = data.url2;
        this.map_url = data.map_url;
        this.memo = data.memo;
        this.hd_sun = data.hd_sun;
        this.hd_mon = data.hd_mon;
        this.hd_tue = data.hd_tue;
        this.hd_wed = data.hd_wed;
        this.hd_thu = data.hd_thu;
        this.hd_fri = data.hd_fri;
        this.hd_sat = data.hd_sat;
        this._fixUndefField();
    }

    /**
     * 過去データとの互換性維持のため
     */
    private _fixUndefField() {
        if (this.url2 == undefined || this.url2 == null) {
            this.url2 = "";
        }
        if (this.map_url == undefined || this.map_url == null) {
            this.map_url = "";
        }
        if (this.pay == undefined) {
            this.pay = "Total";            
        }
    }

    public getData():IDestination {
        return {
            ...this
        };
    } 
}
