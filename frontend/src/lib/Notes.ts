import dayjs, { Dayjs } from 'dayjs';
import {
    DataJson,
    INote,
} from "../typings/data_json";
import {
    CBaseListItem,
    CBaseList
} from "./BaseList";

/**
 * ノートリスト
 */
export class CNoteList extends CBaseList<CNote> {
    list: CNote[] = [];

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data: DataJson) {
        super();
        for (let dt of data.note) {
            this.list.push(this._factoryObject(dt));
        }
    }

    /**
     * 空オブジェクトの生成（継承先でオーバーライトする）
     */
    protected override _factoryObject(data:INote):CNote {
        return new CNote(data);
    }

    /**
     * スケジュールIDに対応するノートを取得する
     * 
     * @param sc_id 
     */
    public getNotesByScheduleId(sc_id:number):CNote[] {
        const index = this._makeIndex();
        if (index[sc_id] === undefined) {
            return [];
        }
        let notes:CNote[] = [];
        index[sc_id].map((i)=>{
            notes.push(this.list[i]);
        })
        return notes;
    }

    /**
     * インデックス生成
     */
    private _makeIndex():number[][] {
        let index:number[][] = [];
        for(let i=0;i<this.list.length;i++) {
            const sc_id:number = this.list[i].sc_id;
            if (index[sc_id] === undefined) {
                index[sc_id] = [];
            }
            index[sc_id].push(i);
        }
        return index;
    }
}

/**
 * ノート
 */
export class CNote extends CBaseListItem implements INote {
    public id:number = 0;
    public sc_id: number = 0;
    public type: string = "";
    public contents: string = "";

    constructor(data?: INote) {
        // 最初にsuperを呼んでおく必要あり
        super({id:0});
        if (data != undefined) {
            this.id = data.id;
            this.sc_id = data.sc_id;
            this.type = data.type;
            this.contents = data.contents;
        }        
    }

    update(data: INote) {
        this.sc_id = data.sc_id;
        this.type = data.type;
        this.contents = data.contents;
    }

    public getData():INote {
        return {
            ...this
        };
    } 
}