<?php
namespace api;
require "./connDB.php";

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

switch ($requestMethod) {
    case 'GET':
        if ($uri[2] === 'tables') {
            $statement = $dbh->prepare("
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='vaccines' 
            ");
            $result = $statement->execute();
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = json_encode($result);
            respond($response);
        }

}