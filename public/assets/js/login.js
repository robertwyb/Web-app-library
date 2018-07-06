$(document).ready(function(){
    $( "#login-btn" ).click(function(){
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
    
        let options = {
            "username" : username,
            "password" : password
        }

        let request = $.ajax({
            type : "POST",
            url : "/auth/login",
            data : options
        })
        .done(function(data){                            
            if (data.data.length == 0){
                alert("Incorrect Password")
            } else {                
                window.location.href="/"
            }
        })    
    })
})