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

    function login($user, $password){
        $result = $this->query('SELECT alias from usuario WHERE alias = ? and contrasenya = ? LIMIT 1', array($user,$password));
        
        if($result){
            echo true;
            return;
        }

        echo false;
    }

}