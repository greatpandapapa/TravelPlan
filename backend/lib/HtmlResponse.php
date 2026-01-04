<?php

namespace Lib;

use Lib\Response;

/**
 * HTMLレスポンスを扱う
 */
class HtmlResponse extends Response {
    // アウトプット
    public function output($method) {
        $app_name = $_ENV["APP_NAME"];

        if ($method != "CLI") {
            header("Content-Type: text/html; charset=utf-8");
        }
        echo "<html>\n";
        echo "<head>\n";
        echo "  <meta charset='utf-8' />\n";
        echo "  <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\" crossorigin=\"anonymous\">\n";
        echo "  <title>".$app_name."</title>\n";
        echo "</head>\n";
        echo "<body>\n";
        foreach($this->data as $line) {
            echo $line."\n";
        }
        echo "</body>\n";
        echo "<html>"."\n";
    }
}