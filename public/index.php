<?php
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__). '/../app'));

const DS = DIRECTORY_SEPARATOR;

require APPLICATION_PATH .DS. '..'.DS. 'config/config.php';
require APPLICATION_PATH .DS . '..'. DS . 'lib/conexion.php';

$loginController = $config['path']['CONTROLLER_PATH']. DS . 'login_controller.php';


if(file_exists($loginController)){
    require $loginController;
}

?>