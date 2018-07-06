$(document).ready(function(){
    $( "#submit-btn" ).click(function(){
        $("#signup-form").submit(function(){
            $.ajax({
              url: "/signup",
              type: "POST",
              data : $("#signup-form").serialize(),
              success: function( data ){
                    console.log(data)
                }
            })
            return false
        })
    })
})