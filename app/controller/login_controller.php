<?php


require $config['path']['MODEL_PATH'] . DS . 'login_model.php';
$login = new LoginModel();

require $config['path']['VIEW_PATH'] . DS .'login' .DS. 'login_view.phtml';