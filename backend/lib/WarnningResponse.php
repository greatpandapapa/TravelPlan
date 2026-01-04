<?php

namespace Lib;

use Lib\JsonResponse;

/**
 * JSONレスポンスを扱う
 */
class WarnningResponse extends JsonResponse {
    /**
     * コンストラクタ
     * @param $data 返すデータ
     */
    public function __construct($data=null,$code=1) {
        $this->data = ["code"=>$code];
        if ($data !== null) {
            $this->data["result"] = $data;
        }
    }
}