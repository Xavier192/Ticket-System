<?php
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__). '/..'));

defined('DS') || define('DS',DIRECTORY_SEPARATOR);

require APPLICATION_PATH .DS. '..'.DS. 'config\config.php';
require APPLICATION_PATH .DS . '..' . DS . 'lib\conexion.php';

if(isset($_POST['type'])){
    decideController($_POST['type']);
}

function decideController($type){
    global $config;

    switch($type){
        case 'login':
            require $config['path']['CONTROLLER_PATH']. DS . 'login_controller.php';
        break;
        case 'signup':
            
        break;
    }
}
