<?php

class Router{
    private $_uri = [];
    private $modelUrl = [];
    private $viewUrl = [];

    public function add($uri,$modelUrl = null, $viewUrl = null){
        $this->_uri [] = $uri;
        $this->modelUrl [] = $modelUrl;
        $this->viewUrl [] = $viewUrl;
    }

    public function submit(){
         $uriUrl = isset($_GET['uri']) ? explode('/',$_GET['uri'])[1] : '/';
        
        foreach($this->_uri as $key => $value){
            if(preg_match("#^$value$#",$uriUrl)){
                if(file_exists($this->modelUrl[$key]) && file_exists($this->viewUrl[$key])){
                    return array($this->modelUrl[$key], $this->viewUrl[$key]);
                }
            }
        }
       
    }
}