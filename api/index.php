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

function readPost() {
    $json = file_get_contents('php://input');
    return json_decode(addslashes($json));
}

function post($uri, $dbh) {
    switch ($uri[3]) {
        case 'delete':
            $post = readPost();
            $statement = $dbh->prepare("
                DELETE FROM $post->table_name WHERE $post->pkey_name = ?;
            ");
            $statement->execute(array($post->pkey_value));
            header('HTTP/1.1 200 OK');
            break;
        case 'update':
            $post = readPost();
            $statement = $dbh->prepare("
                UPDATE $post->table_name
                SET $post->column_name = ?
                WHERE $post->pkey_name = ?
            ");
            $statement->execute(array($post->colum_value, $post->pkey_vaule));
            header('HTTP/1.1 200 OK');
            break;
        case 'create':
            $post = readPost();
            $question = str_repeat("?,",count($post->columns) - 1) . '?';
            $statement = $dbh->prepare("
                INSERT INTO $post->tableName
                VALUES($question)
            ");
            $statement->execute($post->columns);
            header('HTTP/1.1 200 OK');
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