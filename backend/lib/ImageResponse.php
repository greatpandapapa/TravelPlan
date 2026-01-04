<?php

namespace Lib;

use Lib\Response;

/**
 * 画像を返すレスポンスを扱う
 */
class ImageResponse extends Response {
    // アウトプット
    public function output($method) {
        if ($method != "CLI") {
            header('Content-Type: image/png');
            // CORSの preflight request への対応
            header("Access-Control-Allow-Origin: *");    
        }
        imagepng($this->data);
        imagedestroy($this->data);
    }
}