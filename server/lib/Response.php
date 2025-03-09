<?php

namespace Lib;

/**
 * レスポンスの規定クラス
 */
class Response {
    protected $data;
    /**
     * コンストラクタ
     * @param $data 返すデータ
     */
    public function __construct($data) {
        $this->data = $data;
    }
    /**
     * アウトプット
     */
    public function output($method){
        echo $this->data;
    }
    /**
     * Responseデータ取得
     */
    public function getData() {
        return $this->data;
    }
}