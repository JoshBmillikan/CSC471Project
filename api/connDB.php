<?php


function get_db() {
    //Populate these four variables
    $SrvName = "csc471f21millikanjoshua.database.windows.net";//Domain name of database server
    $DBName = "vaccines";//name of your database

    // username and password are set from environment variables on the server
    $SQL_USER = getenv("DB_USER");
    $SQL_PASS = getenv("DB_PASS");
    try {
        $dbh = new PDO("sqlsrv:server = tcp:" . $SrvName . ",1433; Database = " . $DBName, $SQL_USER, $SQL_PASS);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    } catch (PDOException $e) {
        exit("DB Connection Failed: " . $e->getMessage());
    }
}

