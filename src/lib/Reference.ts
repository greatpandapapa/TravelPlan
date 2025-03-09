import {
    DataJson,
    IReference,
} from "../typings/data_json";
import {
    CBaseListItem,
    CBaseList
} from "./BaseList";

/**
 * 参考情報リスト
 */
export class CReferenceList extends CBaseList<CReference> {
    protected list: CReference[] = [];

    /**
     * コンストラクタ
     * 
     * @param data JSONデータ
     */
    constructor(data: DataJson) {
        super();
         for (let dt of data.reference) {
            this.list.push(this._factoryObject(dt));
        }
    }

    /**
     * 空オブジェクトの生成（継承先でオーバーライトする）
     */
    protected override _factoryObject(data:IReference):CReference {
        return new CReference(data);
    }
}

/**
 * 参考情報
 */
export class CReference extends CBaseListItem implements IReference {
    site: string;
    url: string;
    memo: string;

    constructor(data?: IReference) {
        if (data === undefined) {
            super({id:0});
            this.site = "";
            this.url = "";
            this.memo = "";    
        } else {
            super(data);
            this.site = data.site;
            this.url = data.url;
            this.memo = data.memo;    
        }
    }

    public update(data: IReference) {
        this.site = data.site;
        this.url = data.url;
        this.memo = data.memo;
    }

    public getData():IReference {
        return {id:this.id,site:this.site,url:this.url,memo:this.memo};
    } 
}