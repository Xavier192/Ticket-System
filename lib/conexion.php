<?php

function conectar(){
    global $config;
    $dbConfig = $config['db'];
    $db = null;
    $host = $dbConfig['host'];
    $dbName = $dbConfig['dbname'];
    $user = $dbConfig['user'];
    $password = $dbConfig['password'];
    $port = $dbConfig['port'];

    try {
        $db = new PDO("mysql:host=$host;dbname=$dbName; port=$port", $user, $password);
    } catch (PDOException $e) {
        print "¡Error!: " . $e->getMessage() . "<br/>";
        die();
    }

    return $db;
}

