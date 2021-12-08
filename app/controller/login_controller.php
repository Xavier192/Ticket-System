<?php

if(isset($operation)){
    require $config['path']['MODEL_PATH'] . DS . 'login_model.php';
  
    $login = new LoginModel();

    implementOperation($login, $operation);
    
}else{
    require $config['path']['VIEW_PATH'] . DS .'login' .DS. 'login_view.phtml';
}



function implementOperation($login, $operation){
    switch($operation){
        case "login":
        $login->login($_POST['user'], $_POST['password']);
        break;
        case "signup":
        $login->signup($_POST['user'],$_POST['password'],$_POST['email'],$_POST['code']);
        break;
        case "verify":

        if(!$login->verifyCode($_POST['code'])){
            echo 1;
            return;
        }
        if($login->verifyUser($_POST['user'])){
            echo 2;
            return;
        }

        echo false;
        
        break;
    }
}





