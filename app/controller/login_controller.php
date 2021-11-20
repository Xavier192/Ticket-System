<?php

if(isset($type)){
    require $config['path']['MODEL_PATH'] . DS . 'login_model.php';
    $login = new LoginModel();
    $login->login('xavir','1234');
}else{
    require $config['path']['VIEW_PATH'] . DS .'login' .DS. 'login_view.phtml';
}




