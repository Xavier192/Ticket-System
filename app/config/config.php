<?php

$config = [
    "PATH" => [
        "MODEL_PATH" => APPLICATION_PATH. DS . 'model'. DS,
        "VIEW_PATH" => APPLICATION_PATH . DS . 'view' . DS,
        "DATA_PATH" => APPLICATION_PATH . DS . 'data' . DS,
        "LIB_PATH" => APPLICATION_PATH . DS . 'lib' . DS
    ],

    "DB" => [
        "host" => "localhost",
        "dbname" => "sistema_gestion_tickets",
        "password" => "",
        "user" => "root",
        "port" => "3306"
    ]
];

require $config["PATH"]["LIB_PATH"]. 'functions.php';
require $config["PATH"]["LIB_PATH"]. 'router.php';