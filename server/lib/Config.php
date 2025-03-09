<?php

namespace Lib;

/**
 * 設定クラス
 */
class Config {
    // システムのROOTを返す
    private static $rootpath = "c:/workspace/travelplan/server";
    public static function setRootPath($path) {
        self::$rootpath = $path;
    }
    public static function getRootPath() {
        return self::$rootpath;
    }
    // データフォルダのパス
    public static function getDataPath() {
        return self::getRootPath()."/data";
    }
}