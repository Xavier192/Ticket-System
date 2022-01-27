<?php

function get($name, $def = ''){
    return isset($_REQUEST[$name]) ? $_REQUEST[$name] : $def;
}

/*==========================DATABASE CONNECTION AND AUTH=============================*/

function connect(){
    global $config;
    $dbConfig = $config['DB'];
    $db = null;

    try {
        $db = new PDO("mysql:host=".$dbConfig['host'].";dbname=".$dbConfig['dbname']."; port=".$dbConfig['port']."", $dbConfig['user'], $dbConfig['password']);
    } catch (PDOException $e) {
        print "¡Error!: " . $e->getMessage() . "<br>";
        die();
    }

    return $db;
}

function isActive($currentPage, $page){
    return strpos($currentPage,$page) ? 'active' : '';
}

function setIconColor($currentPage, $page){
    return strpos($currentPage,$page) ? true : false;
}

function startSession($name){
    session_start();
    $_SESSION['user'] = $name;
}

/*=============================QUERIES=====================================*/

function prepareStatment($statment){
    global $connection;
    
    return $connection -> prepare($statment); 
}

function query($queryContent, $params){
    $preparedStatment = prepareStatment($queryContent);
    $preparedStatment->execute($params);

    return ($preparedStatment -> FetchAll(PDO::FETCH_ASSOC));
}

function insert($queryContent, $params){
    $preparedStatment = prepareStatment($queryContent);
    $preparedStatment->execute($params);
}

function encryptPassword($input, $rounds = 10){
    $crypt_options = [
      'cost' => $rounds
    ];
    return password_hash($input, PASSWORD_BCRYPT, $crypt_options);
}

/*============================VERIFICATIONS===============================*/

function verifyCode($code){
    $codeExists = query('SELECT count(id_codigo) as id_codigo from codigo WHERE id_codigo = ?', array($code));
    $codeIsUsed = query('SELECT count(codigo) as codigo from usuario WHERE codigo = ?', array($code));

    if(!$codeExists[0]['id_codigo'] || $codeIsUsed[0]['codigo']){
        echo "Código no válido";
        return false;
    }

    return true;
}

function verifyUser($user){
    $userExists = query('SELECT count(id_usuario) as id_usuario FROM usuario WHERE alias = ?', array($user));

    if($userExists[0]['id_usuario']){
        echo 'Usuario no válido';
        return false;
    }

    return true;
}

/*==================================PAGINATION================================*/

function paginate($query, $limit = 10, $page = 1, $params = array()){
    $queryResult = query('SELECT count(*) as number_rows FROM proyecto WHERE id_proyecto is not null', array())[0]['number_rows'];
    $numRows =(int)$queryResult;

    if($limit != 'all'){
        $query = $query . 'LIMIT ' . (($page - 1) * $limit) .', '. $limit;
    }

    $queryResult = query($query, $params);

    foreach($queryResult as $row){
        $results[] = $row;
    }

    $result = new stdClass();

    $result->page = $page;
    $result->limit = $limit;
    $result->numRows = $numRows;
    $result->data = $results;

    return $result;
}

function createLinks($result, $links, $listClass, $liClass){
    if($result->limit === 'all'){
        return '';
    }

    $last = ceil($result->numRows / $result->limit);

    $start = ($result->page - $links > 0) ? $result->page - $links : 1;
    $end = ($result->page + $links < $last) ? $result->page + $links : $last;

    $class = $result->page == 1 ? "disabled" : ""; 
    $html = '<ul class="'.$listClass.'"> <li class="'.$class.' '. $liClass.'"><a href="projects?numPage='.($result->page - 1).'">&laquo;</a></li>';

    if($start > 1){
        $html .= "<li class='$liClass'><a href='projects?numPage=1'>1</a></li><li class='disabled'><span>...</span></li>";
    }

    for($page = $start ;  $page <= $end ; $page++){
        $class = $result->page == $page ? 'active' : "";
        $html .= "<li class='$liClass'><a class='$class' href='projects?numPage=$page'>$page</a></li>";
    }

    if($end < $last){
        $html .= '<li class="disabled"> <span>...</span></li>';
        $html .= "<li class='$liClass'><a href='projects?numPage=$last'>$last</a></li>";
    }

    $class = $result->page == $last ? "disabled": "";

    $html.="<li class='$class $liClass'><a href='projects?numPage=".($result->page +1) ."'> &raquo;</a></li>";

    $html.= "</ul>";

    return $html;
}