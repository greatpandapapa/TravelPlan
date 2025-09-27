<?php

namespace Controller;

use Lib\Controller;
use Lib\SuccessResponse;
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

            $enc_json = json_encode($data,JSON_PRETTY_PRINT);

            $data_path = Config::getDataPath();
            $filename = $data_path."/".$name.".json";
            file_put_contents($filename,$enc_json);
            return new SuccessResponse(); 
        }
        return new SuccessResponse();     
    }

    // ロードする
    public function load() {
        $name = $this->getRequestValue("name");
        $data_path = Config::getDataPath();
        $filename = $data_path."/".$name.".json";
        $json = file_get_contents($filename);

        $data = json_decode($json);
        $resp = ["name"=>$name,"data"=>$data];
        return new SuccessResponse($resp);     
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
            if (isset($data->plan->status)) {
                $status = $data->plan->status;
            } else {
                $status = "Plan";
            }
            $list[] = [ "name"=>$info["filename"],
                        "title"=>$data->plan->title,
                        "purpose"=>$data->plan->purpose,
                        "deparure_date"=>$data->plan->deparure_date,
                        "status"=>$status];
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