import dayjs, { Dayjs } from 'dayjs';
import {
    DataJson,
    IActionItem,
    IValueOptions,
} from "../typings/data_json";
import {
    CBaseListItem,
    CBaseList
} from "./BaseList";

/**
 * 持ち物リスト
 */
export class CActionItemList extends CBaseList<CActionItem> {
    // プライベート
    protected list: CActionItem[] = [];

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data: DataJson) {
        super();
         for (let dt of data.actionitem) {
            this.list.push(this._factoryObject(dt));
        }
    }

    /**
     * 空オブジェクトの生成（継承先でオーバーライトする）
     */
    protected override _factoryObject(data:IActionItem):CActionItem {
        return new CActionItem(data);
    }
    /**
     * 持ち物タイプの選択肢
     */
    public getTypeValueOptions():IValueOptions[] {
        return ([
            {label:"-",value:""},
            {label:"計画",value:"plan"},
            {label:"予約",value:"reservation"}, 
            {label:"申請",value:"admition"}, 
            {label:"購入",value:"buy"}, 
            {label:"その他",value:"other"},
        ]);
    }
}

/**
 * 持ち物
 */
export class CActionItem extends CBaseListItem implements IActionItem {
    name: string;
    type: string;
    limit_date: Date|null;
    memo: string;
    done: boolean;

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data?: IActionItem) {
        if (data === undefined) {
            super({id:0});
            this.name = "";
            this.type = "";
            this.limit_date = null;
            this.memo = ""; 
            this.done = false;
        } else {
            super(data);
            this.name = data.name;
            this.type = data.type;
            this.limit_date = data.limit_date;
            this.memo = data.memo;
            this.done = data.done;    
        }
    }

    public update(data: IActionItem) {
        this.name = data.name;
        this.type = data.type;
        this.limit_date = data.limit_date;
        this.memo = data.memo;
        this.done = data.done;
    }

    public getData():IActionItem {
        return {id:this.id,name:this.name,type:this.type,limit_date:this.limit_date,memo:this.memo,done:this.done};
    } 
}