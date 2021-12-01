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

        return $preparedStatment -> FetchAll();
    }

    function verifyCode($code){
        $result = $this->query('SELECT id_codigo from codigo WHERE id_codigo = ?', array($code));

        if($result){
            echo true;
            return;
        }
        
        echo false;
    }

    function signUp($user, $password, $email, $code){
        
        $result = $this -> query('INSERT INTO usuario VALUES(0,?,?,?)');
    }

    function login($user, $password){
        $result = $this->query('SELECT alias from usuario WHERE alias = ? and contrasenya = ? LIMIT 1', array($user,$password));
        
        if($result){
            echo true;
            return;
        }

        echo 'No te sabes la palabra magica jajjaja';
    }

}