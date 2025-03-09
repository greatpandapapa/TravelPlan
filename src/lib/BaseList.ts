import {
    DataJson,
    IReference,
    IBaseListItem
} from "../typings/data_json";

/**
 * リストのアイテムのベースクラス
 */
export abstract class CBaseListItem implements IBaseListItem {
    id:number;
    constructor(data: IBaseListItem) {
        this.id = data.id;
    }
    public abstract update(data: IBaseListItem):any;
    public abstract getData():any;
}

/**
 * リストのベースクラス
 * 
 * listの型は子クラスで定義するため、ジェネリック型を利用する
 */
export abstract class CBaseList<T extends CBaseListItem>  {
    protected list: T[] = [];
    protected max_id: number;
    protected latest_id: number;

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor() {
        this.max_id = 0;
        this.latest_id = 0;
    }

    /**
     * 空オブジェクトの生成（継承先でオーバーライトする）
     */
    protected abstract _factoryObject(data:any):T;

    /**
     * 最大ID,最終IDを探す
     */
    protected _checkMaxLatestId() {
        this.max_id = 0;
        this.list.map((item: T)=>{
            if (this.max_id < item.id) {
                this.max_id = item.id;
            }
            this.latest_id = item.id;
        });
    }

    /**
     * idからリストのインデックス検索する
     * 
     * @param id IDを指定する
     * @returns listのインデックス
     */
    protected _getIndexById(id:number):number|null {
        let i = 0;
        for (let item of this.list) {
            if (item.id == id) {
                return i;
            }
            i++;
        }
        return null;;
    }

    /**
     * SchedulePanelのDataGrid用のデータを生成する
     */
    public getRows() {
        let rows = [];
        for (let item of this.list) {
            rows.push(item.getData() as ReturnType<T["getData"]>);
        }
        return rows;
    }

    /**
     * 新規データを生成する
     */
    public getNewData() {
        this._checkMaxLatestId();
        return this._factoryObject({"id":this.max_id+1});
    }

    /**
     * スケジュールを追加する
     * 
     * @param data スケジュール情報の配列
    */
    public updateData(data:object) {
        let idx:number|null;
        let data2: IBaseListItem = data as IBaseListItem;

        // データの登録・更新
        idx = this._getIndexById(data2.id);
        if (idx == null) {
            this.list.push(this._factoryObject(data2));
        } else {
            this.list[idx].update(data2);
        }
    }

    /**
     * IDを削除する
     */
    public delData(id:number) {
        let idx: number|null;

        idx = this._getIndexById(id);
        if (idx == null) {
            throw new Error("can't get destination by id:"+id);
        }
        this.list.splice(idx, 1);
    }

    /**
     * 目的地を取得する
     * 
     * @param id 
     * @returns 
     */
    public getData(id:number) {
        let idx: number|null;

        idx = this._getIndexById(id);
        if (idx == null) {
            throw new Error("can't get destination by id:"+id);
        }
        return this.list[idx];
    }

    /**
     * セーブ用データを作成
     */
    public getSaveData():object[] {
        let rows:object[] = [];
        this.list.map((item: T)=>{
            rows.push(item.getData());
        });
        return rows;
    }
}