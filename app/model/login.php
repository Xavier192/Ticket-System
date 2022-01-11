<?php

$current_view = $config["PATH"]["VIEW_PATH"]. 'login'. DS;

switch(get('action')){

    case 'login' : {
        $layout='';
        $user = get('user');
        $password = get('password');
        $passwordHash = query('SELECT contrasenya from usuario WHERE alias = ? LIMIT 1', array($user));
        
        if($passwordHash){
            echo password_verify($password, $passwordHash[0][0]);

            if(password_verify($password, $passwordHash[0][0])){
                $layout = 'main_layout.phtml';
                startSession($user);
            }  
        }

        else{
            echo false;
        }

        break;
    }

    case 'signup' : {
        $layout = '';
        $code = get('code');
        $password = get('password');

        if(verify(get('code'),get('user'))){
            $permissions = query('SELECT permiso FROM codigo WHERE id_codigo = ?', array($code));
            $password = encryptPassword($password);

            $result = insert('INSERT INTO usuario VALUES(?,?,?,?,?,?,?)', array(0,$permissions[0][0],get('user'),$password, get('email'), $code,1));
            
            echo true;
        }

        break;
    }

    default: {
        $view = $current_view. 'login.phtml';
        break;
    }

}

function verify($code, $user){
    if(!verifyCode($code)){
        echo -2;
        return false;
    }if(verifyUser($user)){
        echo -1;
        return false;
    }

    return true;
}

function verifyCode($code){
    $codeExists = query('SELECT count(id_codigo) from codigo WHERE id_codigo = ?', array($code));
    $codeIsUsed = query('SELECT count(codigo) from usuario WHERE codigo = ?', array($code));

    return ($codeExists[0][0] && !$codeIsUsed[0][0]);
}

function verifyUser($user){
    $userExists = query('SELECT count(id_usuario) FROM usuario WHERE alias = ?', array($user));

    return $userExists[0][0];
}

