<?php

$current_view = $config["PATH"]["VIEW_PATH"]. 'login'. DS;
$layout='';

switch(get('action')){
     /*============================LOGIN DATABASE LOGIC===========================*/
    case 'login' : {
        $passwordHash = query('SELECT contrasenya from usuario WHERE alias = ? LIMIT 1', array(get('user')));
        
        if($passwordHash){
            $verify = password_verify(get('password'), $passwordHash[0]['contrasenya']);

            if($verify){
                $layout = 'main_layout.phtml';
                startSession(get('user'));
            }
            
            echo $verify;
        }

        else{
            echo false;
        }
       
        break;
    }

    /*===============================SIGN UP DATABASE LOGIC==============================*/
    case 'signup' : {
        
        if(verifyCode(get('code')) && verifyUser(get('user'))){
            $permissions = query('SELECT permiso FROM codigo WHERE id_codigo = ?', array(get('code')));
            $password = encryptPassword(get('password'));

            $result = insert('INSERT INTO usuario VALUES(?,?,?,?,?,?,?)', array(0,$permissions[0]['permiso'],get('user'),$password, get('email'), get('code'),1));
            
            echo true;
        }

        break;
    }

    default: {
        $layout = 'login_layout.phtml';
        $view = $current_view. 'login.phtml';
        break;
    }

}



