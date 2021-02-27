<?php

    #This file is used to fetch comments from database and to respond to the request from the fetch_comment.js file.

    #Include config file for database connection
    include 'config.php';

    $contentype = isset($_SERVER['CONTENT_TYPE']) ? trim($_SERVER['CONTENT_TYPE']) : '';

    #Checking if the request is valid
    if ($contentype == 'application/json') {
        #Get the body of the request that was sent by the fetch_comment.js file
        $body = trim(file_get_contents("php://input"));
        #Decoding the JSON body
        $decoded = json_decode($body, true);
        #Stripping HTML tags and escaping special chracter to reduce the risk of sql injection
        $url = strip_tags(mysqli_real_escape_string($connector, $decoded['url']));
        $end = strip_tags(mysqli_real_escape_string($connector, $decoded['finish']));
        #Checking database to get the total amount of comments
        $counter = "SELECT * FROM comments WHERE commented_id='$url'";
        $counter = mysqli_query($connector, $counter);
        $num_of_rows = mysqli_num_rows($counter);
        #Fecthing comments with limit
        $end = $end - 10;
        $fetch_limit = "SELECT * FROM comments WHERE commented_id='$url' ORDER BY id desc LIMIT $end, 10";

        $check_db_query = mysqli_query($connector, $fetch_limit);

        if ($num_of_rows <= 0) {
            #Returning an empty array if no comment is available
            $send_back = ['status' => true, 'msg' => []];
            header('Content-Type: application/json');
            echo json_encode($send_back);
        }else if($num_of_rows > 0){
            #Fetching comments if available
            $comments = mysqli_fetch_all($check_db_query, MYSQLI_ASSOC);
            #Returning fetched comments
            $send_back = ['status' => true, 'msg' => [$comments, $num_of_rows]];
            header('Content-Type: application/json');
            echo json_encode($send_back);
        }else{
            #Sending an error back message if an unexpected error occurs
            $send_back = ['status' => false, 'msg' => "Sorry an error occured"];
            header('Content-Type: application/json');
            echo json_encode($send_back);
        }
    }else{
        #Sending an error back if the request type is not valid
        $send_back = ['status' => false, 'msg' => "Sorry an error occured"];
        header('Content-Type: application/json');
        echo json_encode($send_back);
    }
?>