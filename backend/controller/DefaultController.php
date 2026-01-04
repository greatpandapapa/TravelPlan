<?php

namespace Controller;

use Lib\Controller;
use Lib\HtmlResponse;

/**
 * デフォルトのコントローラ
 */
class DefaultController extends Controller {
    public function index() {
        $app_name = $_ENV["APP_NAME"];
        $frontend = $_ENV["FRONTEND_PATH"];

        $body = [];
        $body[] = "<div>";
        $body[] = "<h3>".$app_name."</h3>";
        $body[] = "[<a href=\"".$frontend."\">Main Menu</a>]";
        $body[] = "</div>";
        return new HtmlResponse($body);
    }    
}