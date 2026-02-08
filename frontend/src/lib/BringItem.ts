import dayjs, { Dayjs } from 'dayjs';
import {
    DataJson,
    IBringItem,
    IValueOptions,
} from "../typings/data_json";
import {
    CBaseListItem,
    CBaseList
} from "./BaseList";

/**
 * 持ち物リスト
 */
export class CBringItemList extends CBaseList<CBringItem> {
    // プライベート
    protected list: CBringItem[] = [];

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data: DataJson) {
        super();
         for (let dt of data.bringitem) {
            this.list.push(this._factoryObject(dt));
        }
    }

    /**
     * 空オブジェクトの生成（継承先でオーバーライトする）
     */
    protected override _factoryObject(data:IBringItem):CBringItem {
        return new CBringItem(data);
    }
    /**
     * 持ち物タイプの選択肢
     */
    public getTypeValueOptions():IValueOptions[] {
        return ([
            {label:"-",value:""},
            {label:"お金",value:"money"},
            {label:"チケット",value:"ticket"}, 
            {label:"身分証明",value:"id"}, 
            {label:"衣類",value:"clothes"}, 
            {label:"電子機器",value:"electronic"}, 
            {label:"娯楽",value:"entertainment"}, 
            {label:"情報",value:"information"}, 
            {label:"健康",value:"healthcare"}, 
            {label:"天候対策",value:"weather"}, 
            {label:"その他",value:"other"},
        ]);
    }
}

/**
 * 持ち物
 */
export class CBringItem extends CBaseListItem implements IBringItem {
    name: string;
    type: string;
    memo: string;
    checked: boolean;

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data?: IBringItem) {
        if (data === undefined) {
            super({id:0});
            this.name = "";
            this.type = "";
            this.memo = ""; 
            this.checked = false;
        } else {
            super(data);
            this.name = data.name;
            this.type = data.type;
            this.memo = data.memo;
            this.checked = data.checked;    
        }
    }

    public update(data: IBringItem) {
        this.name = data.name;
        this.type = data.type;
        this.memo = data.memo;
        this.checked = data.checked;
    }

    public getData():IBringItem {
        return {id:this.id,name:this.name,type:this.type,memo:this.memo,checked:this.checked};
    } 
}