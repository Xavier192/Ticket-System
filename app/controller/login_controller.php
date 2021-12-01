<?php

if(isset($operation)){
    require $config['path']['MODEL_PATH'] . DS . 'login_model.php';
  
    $login = new LoginModel();

    if($operation == 'login'){
        $login->login($_POST['user'],$_POST['password']);
    }
    
    else if($operation == 'signup'){
        $login -> signup();
    }
    else if($operation == 'verifyCode'){
        $login -> verifyCode($_POST['code']);
    }
    
}else{
    require $config['path']['VIEW_PATH'] . DS .'login' .DS. 'login_view.phtml';
}





