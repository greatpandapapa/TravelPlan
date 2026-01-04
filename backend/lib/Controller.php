<?php

namespace Lib;

/**
 * APIクラスの基底クラス
 */
class Controller {
    protected $method;
    protected $request;

    /**
     * コンストラクタ
     * 
     * @param $method HTTPメソッド
     * @param $request リクエスト
     */
    public function __construct($method,$request) {
        $this->method = $method;
        $this->request = $request;
    }

    /**
     * APIの本体をコールする
     */
    public function call() {
    }
}