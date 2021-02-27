//Declaring variable to carry needed DOM elements using the id function that was created in the fetch_comment.js file.
const comment_form = id('comment_form');
const comment_input = id('comment');
const comment_btn = id('comment_btn');
const error_logger = id('error_handler');

//Calling function that will submit comment
comment_form.addEventListener('submit', (e)=>{
    e.preventDefault();
    comment_btn.innerHTML = "<div class='loading'></div>";
    post_comment();
});
//Calling function that will submit comment if send button is clicked
comment_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    comment_btn.innerHTML = "<div class='loading'></div>";
    post_comment();
})
//This Function is used to validate the input and make the asynchronous request to add comment.
const post_comment = ()=>{
    //Checking input box is empty
    if (comment_input.value.trim().length == 0) {
        error_logger.className = "error-handler";
        error_logger.innerHTML = "Empty Input";
        comment_btn.innerHTML = "send";
        //Hiding error message after every 2 seconds
        setTimeout(()=>{error_logger.innerHTML = ""}, 2000);
    }else{
        //Calling validator function to check if string contains some restricted chracters
        if (validator(comment_input.value.trim()) != true) {
            error_logger.className = "error-handler";
            error_logger.innerHTML = "Invalid Comment! Only plain text and punctuation mark is allowed";
            comment_btn.innerHTML = "send";
            setTimeout(()=>{error_logger.innerHTML = ""}, 2000);
        }else{
            //Async function that is responsible for sending comment to server and handle error properly
            fetch_async = async ()=>{
                /*
                    The data_to_send object contains the following :
                    1. Comment that was typed by use.
                    2. The url of the page.
                */
                url = document.URL;
                if (url.includes('?') == true) {
                    url = url.split('?');
                    url = url[0]
                }
                const data_to_send = {
                    comment : comment_input.value.trim(),
                    url : url
                };
                const options = {
                    method : "POST",
                    headers : {
                        "Content-type" : "application/json"
                    },
                    body : JSON.stringify(data_to_send)
                }
                const returner = await new Promise((resolve, reject)=>{
                    //Initializing the fetch request
                    fetch('comment_php/submit_comment.php', options).then((res)=>{
                        //Handling recieved JSON data that was recieved from server
                        res.json().then((json)=>{
                            json.status != true ? reject(json.msg) : resolve(json.msg);
                        }).catch(err=>reject("Sorry an error occured, please try again"))
                    }).catch(err=>reject("Sorry an error occured, please try again"))
                    //Sending back a network error if no server response is recieved after 10seconds
                    setTimeout(()=>{
                        reject("Could not drop comment due to network issue. Please check your connection");
                    }, 10000)
                });
                return returner;
            }
            //Calling the async function to send comment
            fetch_async().then((res)=>{
                //Consuming response if comment upload was successful
                error_logger.innerHTML = res; 
                error_logger.className = "success-handler"; 
                comment_btn.innerHTML = "send";
                comment_input.value = "";
                //Running full_function to refresh all the comments
                full_function(10);
            }).catch((err)=>{
                //Handling error if comment upload failed
                error_logger.innerHTML = err; 
                error_logger.className = "error-handler"; 
                comment_btn.innerHTML = "send";});
            setTimeout(()=>{error_logger.innerHTML = ""}, 2000);
        }
    }
}

//This function is used to check if restricted chracters are available in the typed comment 
const validator = (string)=>{
    if (string.includes('~') == true || string.includes('#') == true || string.includes('$') == true || string.includes('%') == true || string.includes('^') == true || 
    string.includes('*') == true || string.includes('(') == true || string.includes(')') == true || string.includes('<') == true || 
    string.includes('>') == true  || string.includes('/') == true || string.includes('"') == true  || string.includes('\'') == true  || string.includes(';') == true || string.includes(':') == true || string.includes('[') == true || string.includes(']') == true
    || string.includes('{') == true || string.includes('}') == true || string.includes('-') == true || string.includes('_') == true || string.includes('+') == true || string.includes('=') == true || string.includes('`') == true
    || string.includes('\\') == true || string.includes('|') == true) {
        return false;
    }else{
        return true;
    }
}
