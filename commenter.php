<?php
    #disallowing direct attempt to access this script
    if ($_SERVER['REQUEST_URI'] != '/commenter.php') {
?>
<!--
    This file contains the UI for poasting and displaying comments
-->
<div class="full-commenting-container">
    <div class="commenting-form-container">
        <form class="comment_form" id="comment_form" onsubmit="return false;">
            <div class="comment-input-container">
                <textarea name="comment" id="comment" class="comment-input"></textarea>
            </div>
            <div class="comment-btn-container">
                <button id="comment_btn" class="comment-btn" type="submit" onclick="return false;">send</button>
            </div>
        </form>
        <p id="error_handler"></p>
    </div>
    <div class="comments-container" id="comments_container">
    </div>
</div>
<script src="comment_js/fetch_comment.js"></script>
<script src="comment_js/submit_comment.js"></script>
<?php   
    }
?>