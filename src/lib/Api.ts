import axios from 'axios';

//const URL="http://localhost:8080/index.php";
let URL:string;
if (process.env.REACT_APP_SERVER_URL == undefined) {
    throw new Error("can't defined REACT_APP_SERVER_URL in .env");
} else {
    URL = process.env.REACT_APP_SERVER_URL;
}

//axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export class API {

    /**
     * ポスト呼び出し
     * 
     * @param json params 
     * @param function callback 
     * @returns 
     */
    static sendPostRequest(params:object,callback:(response_data:object) => void) {
        return axios.post(URL,params)
        .then(function (response) {
            if (response.data.code != 0) {
                throw new Error('サーバAPI呼び出しがエラー応答でした');
            }
            callback(response.data);
        })
        .catch(function (error) {
            console.log(error.stack);
            throw new Error('サーバAPIの呼び出しに失敗しました');
        });    
    }

    // データの読み込み
    static loadData(name:string,callback:(response_data:object) => void) {
        const params = {"controller":"Store","action":"load","name":name};
        return API.sendPostRequest(params,callback);
    }

    // データの保存
    static saveData(name:string,data:object,callback:(response_data:object) => void) {
        const params = {"controller":"Store","action":"save","name":name,"data":data};
        return API.sendPostRequest(params,callback);
    }

    // データの保存
    static getList(callback:(response_data:object) => void) {
        const params = {"controller":"Store","action":"list"};
        return API.sendPostRequest(params,callback);
    }

    // データの削除
    static deleteData(name:string,callback:(response_data:object) => void) {
        const params = {"controller":"Store","action":"delete","name":name};
        return API.sendPostRequest(params,callback);
    }
}
export interface ILoadDataResponse {
    code: number,
    result: {
        name:string,
        data:object;    
    }
} 
export interface IgetListResponse {
    code: number,
    result: IgetListRow[]
} 
export interface IgetListRow {
    name:string,
    title:string;
    purpose:string;
    deparure_date:string;                
    status:string;
}