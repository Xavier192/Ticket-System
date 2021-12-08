<?php

class LoginModel{
    private $db;
    private $user;
    private $password;

    function __construct(){
        $this->db = conectar();
    }

    function serUser(string $user){
        $this->user = $user;
    }

    function setPassword(string $password){
        $this->password = $password;
    }

    function prepareStatment($statment){
        return $this->db -> prepare($statment); 
    }

    function query($queryContent, $params){
        $preparedStatment = $this->prepareStatment($queryContent);
        $preparedStatment->execute($params);

        return ($preparedStatment -> FetchAll())[0];
    }

    function insert($queryContent, $params){
        $preparedStatment = $this->prepareStatment($queryContent);
        $preparedStatment->execute($params);
    }

    function verifyCode($code){
        $codeExists = $this->query('SELECT count(id_codigo) from codigo WHERE id_codigo = ?', array($code));
        $codeIsUsed = $this -> query('SELECT count(codigo) from usuario WHERE codigo = ?', array($code));

        return ($codeExists[0] && !$codeIsUsed[0]);
    }

    function verifyUser($user){
        $userExists = $this->query('SELECT count(id_usuario) FROM usuario WHERE alias = ?', array($user));

        return $userExists[0];
    }

    function signUp($user, $password, $email, $code){
        $permissions = $this -> query('SELECT permiso FROM codigo WHERE id_codigo = ?', array($code));

        $result = $this -> insert('INSERT INTO usuario VALUES(?,?,?,?,?,?,?)', array(0,$permissions[0],$user,$password, $email, $code,1));
    }

    function login($user, $password){
        $result = $this->query('SELECT count(alias) from usuario WHERE alias = ? and contrasenya = ? LIMIT 1', array($user,$password));
        
        echo $result[0];
    }

}