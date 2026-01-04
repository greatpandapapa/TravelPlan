<?php

namespace Lib;

use Lib\InputCheckException;

/**
 * ゲーム用のトレイト
 */
trait CommonControllerTrait {
    public function getRequestValue($key) {
        if (! isset($this->request[$key])) {
            throw new InputCheckException(sprintf("%sが指定されていません",$key));
        }
        return $this->request[$key];
    }
    public function getRequestValueWithoutCheck($key) {
        if (! isset($this->request[$key])) {
            return null;
        }
        return $this->request[$key];
    }
}