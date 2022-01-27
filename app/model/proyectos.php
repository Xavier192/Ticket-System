<?php

session_start();

if(!$_SESSION['user']){
    header('location: ?page=login');
}

$current_view = $config['PATH']['VIEW_PATH']. 'proyectos'. DS;
$projectQuery = 'SELECT nombre, descripcion, fecha_creacion, max_tickets_abiertos FROM Proyecto Where id_proyecto is not null ';


$view = $current_view. 'vista_proyectos.phtml';
$numPage = get('numPage');
$projects = paginate($projectQuery, 2, $numPage);
    


