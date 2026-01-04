<?php

namespace Lib;

use Lib\JsonResponse;

/**
 * JSONレスポンスを扱う
 */
class ErrorResponse extends JsonResponse {
    /**
     * コンストラクタ
     * @param $data 返すデータ
     */
    public function __construct($code,$message=null) {
        $this->data = ["code"=>$code];
        if ($message !== null) {
            $this->data["message"] = $message;
        }
    }
}