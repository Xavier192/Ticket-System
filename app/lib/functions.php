<?php

function get($name, $def = ''){
    return isset($_REQUEST[$name]) ? $_REQUEST[$name] : $def;
}

function connect(){
    global $config;
    $dbConfig = $config['DB'];
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

function isActive($currentPage, $page){
    return $currentPage === $page ? 'active' : '';
}

function prepareStatment($statment){
    global $connection;
    
    return $connection -> prepare($statment); 
}

function query($queryContent, $params){
    $preparedStatment = prepareStatment($queryContent);
    $preparedStatment->execute($params);

    return ($preparedStatment -> FetchAll());
}

function insert($queryContent, $params){
    $preparedStatment = prepareStatment($queryContent);
    $preparedStatment->execute($params);
}

function encryptPassword($input, $rounds = 10){
    $crypt_options = [
      'cost' => $rounds
    ];
    return password_hash($input, PASSWORD_BCRYPT, $crypt_options);
}

function startSession($name){
    session_start();
    $_SESSION['user'] = $name;
}