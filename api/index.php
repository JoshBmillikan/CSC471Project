<?php
namespace api;
require "./connDB.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

if ($uri[1] !== 'api') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

$dbh = get_db();

$requestMethod = $_SERVER["REQUEST_METHOD"];

function respond($response) {
    header($response['status_code_header']);
    if ($response['body']) {
        echo $response['body'];
    }
}

function get($uri, $dbh) {
    switch ($uri[3]) {
        case 'list':
            $tableName = $_GET["table_name"];
            $statement = $dbh->prepare("
                SELECT * FROM ?;
            ");
            if($statement->execute($tableName)) {
                $result = $statement->fetchAll();
                $response['status_code_header'] = 'HTTP/1.1 200 OK';
                $response['body'] = json_encode($result);
                respond($response);
            } else {
                header('HTTP/1.1 502 Bad Gateway');
            }

            break;
        default: header('HTTP/1.1 404 Not Found');
    }
}

switch (strtoupper($requestMethod)) {
    case 'GET':
        get($uri,$dbh);
        break;
    case 'POST':
        //todo
        break;
    default: header('HTTP/1.1 400 Bad Request');
}