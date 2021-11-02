<?php
//Populate these four variables
$SrvName = "csc471f21millikanjoshua.database.windows.net";//Domain name of database server
$DBName = "vaccines";//name of your database
$SQL_USER = "josh";//SQL user
$SQL_PASS = "<Your Password Here>";//SQL password

try{
$dbh = new PDO("sqlsrv:server = tcp:".$SrvName.",1433; Database = ".$DBName, $SQL_USER, $SQL_PASS);
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
 exit("DB Connection Failed: ".$e->getMessage());
}
?>
