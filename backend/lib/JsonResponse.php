<?php

namespace Lib;

use Lib\Response;

/**
 * JSONレスポンスを扱う
 */
class JsonResponse extends Response {
    // アウトプット
    public function output($method) {
        if ($method != "CLI") {
            header("Content-Type: application/json; charset=utf-8");
            // CORSの preflight request への対応
            header("Access-Control-Allow-Origin: *");    
        }
        echo json_encode($this->data,JSON_NUMERIC_CHECK);
    }
}