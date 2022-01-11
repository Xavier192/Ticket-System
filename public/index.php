<?php
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__). '/../app'));

const DS = DIRECTORY_SEPARATOR;

require APPLICATION_PATH. DS . 'config' . DS . 'config.php';

$page = get('page', 'login');

$connection = connect();
$layout = 'main_layout.phtml';

if($page === 'login'){
    $layout = 'login_layout.phtml';
}

$model = $config["PATH"]['MODEL_PATH']. $page. '.php';
$view = $config["PATH"]["VIEW_PATH"]. $page . '.phtml';
$_404 = $config["PATH"]["VIEW_PATH"]. '404.phtml';

$main_content = $_404;

if(file_exists($model)){
    require $model;
}

if(file_exists($view)){
    $main_content = $view;
}

if($layout){
    include $config['PATH']["VIEW_PATH"]. $layout;
}

