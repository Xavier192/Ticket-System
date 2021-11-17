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

    function login(){
        
    }

}