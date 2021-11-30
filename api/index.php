<?php

namespace api;

use Exception;
use PDO;

require "./connDB.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// for testing
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,DELETE,UPDATE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

if ($uri[1] !== 'api') {
    header("HTTP/1.1 404 Not Found");
    exit();
}

$dbh = get_db();

$requestMethod = $_SERVER["REQUEST_METHOD"];

function respond($response)
{
    header($response['status_code_header']);
    if ($response['body']) {
        echo $response['body'];
    }
}

const validNames = array(
    'patient' => 'id',
    'vaccine' => 'sci_name',
    'allergy' => 'patient_id',
    'takes' => 'patient_id',
    'vaccination_site' => 'name'
);

function readPost()
{
    $json = json_decode(file_get_contents('php://input'));
    if(property_exists($json,'table_name')){
        if(!in_array($json->table_name,validNames))
            throw new Exception('table name is not valid');
        if(property_exists($json,'pkey_name')) {
            if($json->pkey_name != validNames[$json->table_name])
                throw new Exception('Wrong primary key name');
        }
    }
    return $json;
}

try {
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
                WHERE $post->pkey_name = ?;
            ");
            $statement->execute(array($post->column_value, $post->pkey_value));
            header('HTTP/1.1 200 OK');
            break;
        case 'create':
            $post = readPost();
            $question = str_repeat("?,", count($post->column_data) - 1) . '?';
            $statement = $dbh->prepare("
                INSERT INTO $post->table_name
                VALUES($question);
            ");
            $statement->execute($post->column_data);
            header('HTTP/1.1 200 OK');
            break;
        case 'list':
            $tableName = htmlspecialchars($_GET["table_name"]);
            $statement = $dbh->prepare("
                SELECT * FROM $tableName;
            ");
            if ($statement->execute()) {
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                $response['status_code_header'] = 'HTTP/1.1 200 OK';
                $response['body'] = json_encode($result);
                respond($response);
            } else {
                header('HTTP/1.1 502 Bad Gateway');
            }

            break;
        default:
            header('HTTP/1.1 400 Bad Request');
    }
} catch (\Exception $e) {
    header('HTTP/1.1 400 Bad Request');
    echo $e->getMessage();
}