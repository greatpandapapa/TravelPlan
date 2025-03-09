<?php

// DBファイル名
//define('DB_FILE',dirname(__FILE__)."/db/hexmap.sqlite");

// Composerのautoloader
// php composer dump-autoload
require('vendor/autoload.php');
require('lib/bootstrap.php');

// .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

use Lib\Config;
use Lib\ErrorResponse;
use Lib\Recoder;

// システムルートを設定
config::setRootPath(dirname(__FILE__));

$log = new Logger('hexmap');
$log->pushHandler(new StreamHandler(__DIR__.'/log/'.date("Ymd").'.log'));

$controller = "Default";
$action = "index";
if (php_sapi_name() == 'cli') {
    $method = "CLI";    
    if (isset($argv[1]) and $argv[1] == "--") {
        $json = file_get_contents('php://stdin');
        $request = json_decode($json, true);
    } else {
        $request = [];
        for($i=1;$i < count($argv);$i++) {
            if (preg_match("/^\-\-([\w\d\_]+)\=(.*)/",$argv[$i],$matches)) {
                $request[$matches[1]] = $matches[2];
            } else {
                if (! isset($request["controller"])) {
                    $request["controller"] = $argv[$i];
                } else if (! isset($request["action"])) {
                    $request["action"] = $argv[$i];
                }
            }
        }
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $method = "POST";
    $json = file_get_contents('php://input');
    $request = json_decode($json, true);
//    $request = array_merge($json,$_POST);
} else if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $method = "GET";
    $request = $_GET;
} else if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    // CORSの preflight request への対応
    // 通常のリクエスト出ない場合に事前にCORS検証のためのpreflight requestが送付される
    // その時に以下のヘッダーを送ることで、以降のリクエストが送付されるようになる
    // https://labor.ewigleere.net/2020/10/13/cors_preflight_request_verification/
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    header("Access-Control-Allow-Methods: GET, POST, HEAD, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    echo "Preflight Request";
    exit;
}

if (isset($request["controller"])) {
    $controller = $request["controller"];
}
if (isset($request["action"])) {
    $action = $request["action"];
}

$log->debug("Method:".$method.",controller:".$controller.",action:".$action);

$controller_class = "Controller\\".$controller."Controller";
if (class_exists($controller_class)) {
    $controller_obj = new $controller_class($method,$request);
    if (method_exists($controller_obj,$action)) {
        try {
            $response = $controller_obj->$action();
            //Recoder::recode($method,$controller,$action,$request,$response->getData());
        } catch (InputCheckException $e) {
            $log->error("Exception:".$e->getMessage());
            $response = new ErrorResponse(1,$e->getMessage());
        } catch (Exception $e) {
            $log->error("Exception:".$e->getMessage());
            $log->error("Exception trace:".$e->getTraceAsString());
            $response = new ErrorResponse(99,$e->getMessage());
        }
        $response->output($method);
    } else {
        $log->error("Undefined action");
    }
} else {
    $log->error("Undefined controller:".$controller_class);
}
