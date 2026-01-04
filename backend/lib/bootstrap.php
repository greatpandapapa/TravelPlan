<?php

use Illuminate\Database\Capsule\Manager as DB;

// ファイルが存在しなければ作成する
if (defined('DB_FILE')) {
    if (! file_exists(DB_FILE)) {
        if (! file_exists(dirname(DB_FILE))) {
            mkdir(dirname(DB_FILE));
        }
        touch(DB_FILE);
    }

    $capsule = new DB;

    $capsule->addConnection([
        'driver'    => 'sqlite',
        'database'  => DB_FILE,
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci',
        'prefix'    => '',
    ]);
    
    $capsule->setAsGlobal();
    $capsule->bootEloquent();
}
