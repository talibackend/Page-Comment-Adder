<?php
    #This file is used to upload comment to database and respond to the request from submit_comment.js file

    #Include config file for database connection
    include 'config.php';

    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

    #Checking if the request is valid
    if ($contentType === "application/json") {
        
        #Get the body of the request that was sent by the fetch_comment.js file
        $content = trim(file_get_contents("php://input"));
        #Decoding the JSON body
        $decoded = json_decode($content, true);
        if ($connector == false) {
            #Sending a error message if database connection failed
            $send_back = ['status' => false, 'msg' => "Sorry an error occured, please try again"];
            header('Content-Type: application/json');
            echo json_encode($send_back);
        }else{
            #Stripping HTML tags and escaping special chracter to reduce the risk of sql injection
            $comment = strip_tags(mysqli_real_escape_string($connector, $decoded['comment']));
            $url = strip_tags(mysqli_real_escape_string($connector, $decoded['url']));
            /*
                The commenter variable contains the name, username, email or any unique string that can be used to identify the person that made the comment.
                In most cases the commenter variable should be from the $_SESSION global variable.
                If you are having problem in setting the value of your commenter vraiable, please contact me and I promise to fix it immediately.
    
                Contact:
                E-mail : fatokunfemi03@gmail.com
                Phone : +234 9047238648
                Whatsapp : +234 9047238648
                Twitter : @FemiFatokun3
                Facebook : www.facebook.com/femi.fatokun.165
                Github : www.github.com/FemiFatokun03
            */
            $commenter = strip_tags(mysqli_real_escape_string($connector, 'Anonymous User'));
            if (empty($comment) || empty($url)) {
                #Sending error if comment or url is empty
                $send_back = ['status' => false, 'msg' => "Please type a comment"];
                header('Content-Type: application/json');
                echo json_encode($send_back);
            }else{
                $check = "SELECT * FROM comments WHERE commenter_id='$commenter' && commented_id='$url' && comment='$comment'";
                $check = mysqli_query($connector, $check);
                $num = mysqli_num_rows($check);
                if ($num > 0) {
                    /* 
                        Checking if comment the same comment has been posted by the same user before.
                        The benefits of this include :
                        1. Avoid duplicate comments from same user due to clicking send button twice.
                        2. Minimize the use of resources.
                    */
                    $send_back = ['status' => true, 'msg' => "Commented"];
                    header('Content-Type: application/json');
                    echo json_encode($send_back);
                }else if($num <= 0){
                    $query = "INSERT INTO comments(commenter_id, commented_id, comment)VALUES('$commenter', '$url', '$comment')";
                    if (mysqli_query($connector, $query)) {
                        #Sending a success message if comment upload is successful
                        $send_back = ['status' => true, 'msg' => "Commented"];
                        header('Content-Type: application/json');
                        echo json_encode($send_back);
                    }else{
                        #Sending a error message if comment upload is failed
                        $send_back = ['status' => false, 'msg' => "Sorry an error occured, please try again"];
                        header('Content-Type: application/json');
                        echo json_encode($send_back);
                    }
                }
            }
        }
    }else{
        #Sending an error back if the request type is not valid
        $send_back = ['status' => true, 'msg' => "Sorry an error occured"];
        header('Content-Type: application/json');
        echo json_encode($send_back);
    }
?>