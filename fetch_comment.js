/**
 This File is used to fetch comments using the asynchronous fetch request. 
 */


//Global function to access every DOM element by Id.
function id(x){
    return document.getElementById(x);
}

//Getting default dic to display comments
const div_to_consume = id('comments_container');

//This function contains all the needed sub-functions that work collectively to enable a proper asynchronous request and clean error handling
const full_function = (finish)=>{
    finish = parseInt(finish);
    div_to_consume.innerHTML = "<div class='loading-comment'></div>";
    //This sync function used to request comments from the server
    const fetch_all_comment = async ()=>{
        /*
            The body_content object contains the following :
            1. The url of the page.
            2. The limit of comments that we want to fetch.
        */
        url = document.URL;
        if (url.includes('?') == true) {
            url = url.split('?');
            url = url[0]
        }
        const body_content = {
            url : url,
            finish : finish
        }
        const send_options = {
            method : "POST", 
            headers : {
                'Content-type' : 'application/json'
            }, 
            body : JSON.stringify(body_content)
        };
        const fetcher = await new Promise((resolve, reject)=>{
            //initializing the fetch request
            fetch('comment_php/fetch_comment.php', send_options).then((res)=>{
                //Handling recieved JSON data that was recieved from server
                res.json().then((json)=>{
                    json.status != true ? reject(json.msg) : resolve(json.msg);
                }).catch(err=>reject("Sorry an error occured, please reload page."))
            }).catch(err=>reject("Sorry an error occured, please reload page."))
            //Sending back a network error if no server response is recieved after 10seconds
            setTimeout(()=>{reject("Could not load comments due to network issue. Please check your connection")}, 10000);
        });
        /*
            Returning an array that contains.
            1. JSON formatted comment array.
            2. The Limit of comments per page.
            3. Number of total comments.
        */
        return [fetcher[0], finish, fetcher[1]];
    }
    /*
        This function is used to format the difference between the current time and time of comment into a readable and more friendly Time Interval String. 
    */
    const time_ago = (dif)=>{
        seconds = Math.round(dif/1000);
        if (seconds > 59) {
            minutes = Math.round(seconds / 60);
            if (minutes > 59) {
                hours = Math.round(minutes / 60);
                minutes = minutes % 60;
                if (hours > 23) {
                    days = Math.floor(hours / 24);
                    hours = hours % 24;
                    if (days > 6) {
                        weeks = Math.floor(days / 7);
                        days = days % 7;
                        if (weeks > 3) {
                            months = Math.floor(weeks / 4);
                            weeks = weeks % 4;
                            if (months > 11) {
                                years = Math.floor(months / 12);
                                months = months % 12;
                                return `${years} year(s) ${months} month(s) ago`;
                            }else{
                                return `${months} month(s) ${weeks} week(s) ago`;
                            }
                        }else{
                            return `${weeks} week(s) ${days} day(s) ago`;
                        }
                    }else{
                        return `${days} day(s) ${hours} hour(s) ago`;
                    }
                }else{
                    return `${hours} hour(s) ${minutes} minute(s) ago`;
                }
            }else{
                return `${minutes} minute(s) ago`;
            }
        }else{
            return `${seconds} second(s) ago`;
        }
    }
    /*
        This function is used for the following :
        1. Format timestamp for each comment into more readable and friendly Time and Date string.
        2. Call time_ago function to format time difference into friendly Time Interval String.
        3. Returns Time/Date String and Time Interval String.
    */
    const date_time_formatter = (timestamp)=>{
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const year = new Date(timestamp).getFullYear();
        const month = new Date(timestamp).getMonth();
        const day = new Date(timestamp).getDay();
        const date = new Date(timestamp).getDate();
        const hour = new Date(timestamp).getHours();
        const minutes = new Date(timestamp).getMinutes();
        new_hour = hour;
        time_mode = 'AM';
        if (hour > 12) {
            new_hour = hour - 12;
            time_mode = 'PM';
        }else if(hour == 12){
            new_hour = 12;
            time_mode = 'PM';
        }
        const formated_year = `${days[day]} ${date} ${months[month]}, ${year}`;
        const formated_time = `${new_hour}:${minutes} ${time_mode}`;
        const comment_time = new Date(timestamp).getTime();
        const current_time = new Date().getTime();
        const difference = current_time - comment_time;
        return [`${formated_time} on ${formated_year}`, time_ago(difference)];
    }
    /*
        This function is used to format and send recieved comments into the default div.
    */
    const comment_formatter = (comments_array, end, total)=>{
        div_to_consume.innerHTML = "";
        div_to_consume.className = "comments-container";
        if (total == undefined) {
            //Sending a string, if page has no comments
            div_to_consume.innerHTML = "No comments available";
            div_to_consume.className = "big_error_handler";
        }else if(total == 1){
            //Avoiding loop to reduce resource usage if page contains only one comment
            const element = comments_array[0];
            const date = date_time_formatter(element.time);
            div_to_consume.innerHTML += `
                <div class="each_comment-container">
                    <p class="commenter-name">${element.commenter_id}</p>
                    <h3 class="comment-body">${element.comment}</h3>
                    <div class="comment-details">
                        <p class="comment-date">${date[0]}</p>
                        <p class="comment-time-ago">${date[1]}</p>
                    </div>
                </div>`
            ;
        }else{
            //Using loop to format comments into the default div since comment is more than one.
            const length = comments_array.length;
            div_to_consume.innerHTML += `<p class="comment_indicator">This page has ${total} comments</p>`;
            for (let index = 0; index < length; index++) {
                const element = comments_array[index];
                const date = date_time_formatter(element.time);
                div_to_consume.innerHTML += `
                    <div class="each_comment-container">
                        <p class="commenter-name">${element.commenter_id}</p>
                        <h3 class="comment-body">${element.comment}</h3>
                        <div class="comment-details">
                            <p class="comment-date">${date[0]}</p>
                            <p class="comment-time-ago">${date[1]}</p>
                        </div>
                    </div>`
                ;
            }
            //Send the next and previous button to the default div since comment is more than one
            div_to_consume.innerHTML += `
                <div class="next_previous_container">
                    <div class="previous_container" id="previous_container">
                        <button name="paginate_button" id="previous" onclick="full_function(${parseInt(end - 10)})" class="comment-btn">Previous</button>
                    </div>
                    <div class="next_container" id="next_container">
                        <button name="paginate_button" id="next" onclick="full_function(${parseInt(end + 10)})" class="comment-btn">Next</button>
                    </div>
                </div>
            `;
            //Nested conditions to handle the display of Next and Previous Button.
            if (total <= 10) {
                id('previous_container').innerHTML = '';
                id('next_container').innerHTML = '';
            }else{
                if (end <= 10) {
                    id('previous_container').innerHTML = '';
                }else{
                    if (total <= end) {
                        id('next_container').innerHTML = '';
                    }
                }
            }
        }
        //0.75Hp My Home
    }
    //Calling the async function to fetch comments
    fetch_all_comment().then((res)=>{
        //Calling the comment formatteer, in order to load recieved comments into DOM
        comment_formatter(res[0], res[1], res[2]);
    }).catch((err)=>{
        //Handling any error recieved from the async function.
        div_to_consume.innerHTML = err;
        div_to_consume.className = "big_error_handler";
    });
}
/*
    The following statement is used for the following :
    1. Making sure that the page have finished loading before fetching comments.
    2. Calling the full_function to fetch all the last 10 comments.
*/
document.addEventListener('DOMElementLoaded', full_function(10));
//The following statement is used to update comments after every 5 minutes
setInterval(()=>{full_function(10)}, 1000*60*5);
