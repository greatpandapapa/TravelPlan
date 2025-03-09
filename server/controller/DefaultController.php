<?php

namespace Controller;

use Lib\Controller;
use Lib\HtmlResponse;

// モデル
use Model\Game;

/**
 * デフォルトのコントローラ
 */
class DefaultController extends Controller {
    public function index() {
        $body = [];
        $body[] = "<div>";
        $body[] = "<h3>Travel Plan</h3>";
        $body[] = "[<a href=\"../build/\">Main Menu</a>]";
        $body[] = "</div>";
        return new HtmlResponse($body);
    }    
}