<?php
namespace api;
use PDO;

require "./connDB.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// for testing
header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST");
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
            $tableName = htmlspecialchars($_GET["table_name"]);
            $statement = $dbh->prepare("
                SELECT * FROM $tableName;
            ");
            if($statement->execute()) {
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
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

function post($uri, $dbh) {
    switch ($uri[3]) {
        case 'delete':
            $tableName = htmlspecialchars($_POST["table_name"]);
            $pkeyName = htmlspecialchars($_POST["pkey_name"]);
            $pkeyVal = htmlspecialchars($_POST["pkey_value"]);
            $statement = $dbh->prepare("
                DELETE FROM $tableName WHERE $pkeyName = ?;
            ", $pkeyVal);
            $statement->execute();
            header('HTTP/1.1 200 OK');
            break;
        case 'update':
            $tableName = htmlspecialchars($_POST["table_name"]);
            $pkeyName = htmlspecialchars($_POST["pkey_name"]);
            $pkeyVal = htmlspecialchars($_POST["pkey_value"]);
            //todo
            break;
        case 'create':
            $tableName = htmlspecialchars($_POST["table_name"]);
            $columns = preg_split(",",htmlspecialchars($_POST["columns"]));
            $question = str_repeat("?,",count($columns) - 1) . '?';
            $statement = $dbh->prepare("
                INSERT INTO $tableName
                VALUES($question)
            ",$columns);
            $statement->execute();
            break;
        default: header('HTTP/1.1 400 Bad Request');
    }
}

switch (strtoupper($requestMethod)) {
    case 'GET':
        get($uri,$dbh);
        break;
    case 'POST':
        post($uri,$dbh);
        break;
    default: header('HTTP/1.1 400 Bad Request');
}