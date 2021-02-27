<?php
    /*
        This file contains the database connection patterns, it uses the php/mysql procedural method.
        All the parameters in this file depends on your database configuration, and it's unique to you alone.
        
        If you are having any problem in connecting to your database please contact me and I promise to fix it for you

        Contact:
        E-mail : fatokunfemi03@gmail.com
        Phone : +234 9047238648
        Whatsapp : +234 9047238648
        Twitter : @FemiFatokun3
        Facebook : www.facebook.com/femi.fatokun.165
        Github : www.github.com/FemiFatokun03

    */
    $server = '';
    $user = 'root';
    $pass = '';
    $database = 'comment';
    $connect = mysqli_connect($server, $user, $pass, $database);
    $connector = $connect ? $connect : false;
?>