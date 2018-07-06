$(document).ready(function(){
    $("#submit-btn").click(function(){
        let currentPassword = $( "#current-password" ).val()
        let newPassword = $( "#new-password" ).val()
        let confirmPassword = $( "#confirm-password" ).val()

        if (newPassword != confirmPassword){
            alert("New password and Confirm password does not match!")
        } else {
            let data = {
                "currentPassword" : currentPassword,
                "newPassword" : newPassword,
                "confirmPassword" : confirmPassword
            }
            let request = $.ajax({
                type : "PUT",
                url : "/auth/password",
                data : data
            })
            .done(function(data){
                if (data.status == "incorrect password"){
                    alert("Incorrect current password")
                } else {
                    alert("Password changed!")
                    window.location.href = "/"
                }
            })
        }
    })
})