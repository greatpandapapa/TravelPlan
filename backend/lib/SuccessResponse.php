<?php

namespace Lib;

use Lib\JsonResponse;

/**
 * JSONレスポンスを扱う
 */
class SuccessResponse extends JsonResponse {
    /**
     * コンストラクタ
     * @param $data 返すデータ
     */
    public function __construct($data=null) {
        $this->data = ["code"=>0];
        if ($data !== null) {
            $this->data["result"] = $data;
        }
    }
}