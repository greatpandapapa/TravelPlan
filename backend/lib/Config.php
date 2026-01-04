<?php

namespace Lib;

/**
 * 設定クラス
 */
class Config {
    // システムのROOTを設定
    private static $rootpath = "c:/home/app/backend";
    public static function setRootPath($path) {
        self::$rootpath = $path;
    }
    // システムのROOTを返す
    public static function getRootPath() {
        return self::$rootpath;
    }
    // データフォルダのパス
    public static function getDataPath() {
        return self::_mkdirPath(self::getRootPath()."/data");
    }
    // データフォルダのパス
    public static function getBackupPath() {
        return self::_mkdirPath(self::getRootPath()."/backup");
    }
    // パスを確認しなければ作成する
    private static function _mkdirPath($path) {
        if (! is_dir($path)) {
            mkdir($path);
        }
        return $path;
    }
}