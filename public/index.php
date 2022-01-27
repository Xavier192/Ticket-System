<?php
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__). '/../app'));

const DS = DIRECTORY_SEPARATOR;

require APPLICATION_PATH. DS . 'config' . DS . 'config.php';

$connection = connect();

$router = new Router();

$router->add('/',$config['PATH']['MODEL_PATH'].'login.php', $config['PATH']['VIEW_PATH'].'login/login.phtml');
$router->add('login',$config['PATH']['MODEL_PATH'].'login.php', $config['PATH']['VIEW_PATH'].'login/login.phtml');
$router->add('dashboard', $config['PATH']['MODEL_PATH'].'home.php',$config['PATH']['VIEW_PATH'].'home.phtml');
$router->add('projects', $config['PATH']['MODEL_PATH']. 'proyectos.php',$config['PATH']['VIEW_PATH'].'proyectos'. DS . 'vista_proyectos.phtml');
$router->add('users', $config['PATH']['MODEL_PATH']. 'usuarios.php', $config['PATH']['VIEW_PATH']. 'usuarios'. DS . 'usuarios.phtml');
$router->add('tickets', $config['PATH']['MODEL_PATH'].'tickets.php',$config['PATH']['VIEW_PATH'].'tickets'. DS . 'tickets.phtml');
$router->add('calendar',$config['PATH']['MODEL_PATH'].'calendario.php',$config['PATH']['VIEW_PATH'].'calendario'. DS . 'calendario.phtml');

$match = $router->submit();

$model = $match[0];
$view  = $match[1];

$main_content = $view;
$layout = 'main_layout.phtml';

if(strpos($view,'login')){
    $layout = 'login_layout.phtml';
}

require $model;

if($layout){
    include $config['PATH']['VIEW_PATH'].'layouts'. DS .$layout;
}