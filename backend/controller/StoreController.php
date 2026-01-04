<?php

namespace Controller;

use Lib\Controller;
use Lib\SuccessResponse;
use Lib\WarnningResponse;
use Lib\CommonControllerTrait;
use lib\Config;
use Lib\JsonResponse;

/**
 * セーブ・ロードするコントローラ
 */
class StoreController extends Controller {
    use CommonControllerTrait;

    // セーブする
    public function save() {
        $name = $this->getRequestValue("name");
        if ($name != "_template") {
            $data = $this->getRequestValue("data");

            $data_path = Config::getDataPath();
            $filename = $data_path."/".$name.".json";
            // 上書き防止のRevチェック
            if (file_exists($filename)) {
                $json = file_get_contents($filename);
                $cur_data = json_decode($json,true);
                // サーバ側のファイルにRevがない場合はチェックしない（古いデータとの互換性のため）
                if (isset($cur_data["plan"]["rev"])) {
                    if ($cur_data["plan"]["rev"] != $data["plan"]["rev"]) {
                        return new WarnningResponse(["mesg"=>"ファイルが他のユーザにより更新されています"],2);
                    }
                    // 古いバイルをバックアップ
                    $backup_path = Config::getBackupPath();
                    $backupname = $backup_path."/".$name.".json".".".$data["plan"]["rev"];
                    rename($filename,$backupname);
                    // Revをインクリメント
                    $data["plan"]["rev"]++;
                }
            }

            // ファイル保存
            $enc_json = json_encode($data,JSON_PRETTY_PRINT);
            file_put_contents($filename,$enc_json);
            return new SuccessResponse(); 
        } else {
            return new WarnningResponse(["mesg"=>"_templateというファイル名では保存できません"],2);
        }
        return new SuccessResponse();     
    }

    // ロードする
    public function load() {
        $name = $this->getRequestValue("name");
        $data_path = Config::getDataPath();
        $filename = $data_path."/".$name.".json";
        if (! file_exists($filename)) {
            return new WarnningResponse(["mesg"=>"ファイルが存在しません"],1);
        } else {
            $json = file_get_contents($filename);
            $data = json_decode($json);
            $resp = ["name"=>$name,"data"=>$data];
            return new SuccessResponse($resp);     
        }
    }

    // リスト出力
    public function list() {
        $data_path = Config::getDataPath();
        $path = $data_path."/*.json";
        $list = [];
        foreach(glob($path) as $filename) {
            $json = file_get_contents($filename);
            $data = json_decode($json);
            $info = pathinfo($filename);
            $list[] = [ "name"=>$info["filename"],
                        "title"=>$data->plan->title,
                        "purpose"=>$data->plan->purpose,
                        "status"=>(isset($data->plan->status)?$data->plan->status:""),
                        "create_date"=>(isset($data->plan->create_date)?$data->plan->create_date:""),
                        "update_date"=>(isset($data->plan->update_date)?$data->plan->update_date:""),
                        "rev"=>(isset($data->plan->rev)?$data->plan->rev:0),
                    ];
        }
        return new SuccessResponse($list);     
    }

    // セーブする
    public function delete() {
        $name = $this->getRequestValue("name");
        if ($name != "_template") {
            $data_path = Config::getDataPath();
            $filename = $data_path."/".$name.".json";
            unlink($filename);
            return new SuccessResponse(); 
        }
        return new SuccessResponse();     
    }
}