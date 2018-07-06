$(document).ready(function(){
    var socket = io('http://localhost:3000')
    socket.on('push', function (data) {
        console.log(data)
        $("<div class='alert alert-info alert-dismissable'> \
            <a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> \
            <strong> Admin Message </strong> \
            <p> " + data.data + " </p> \
        </div>").appendTo("#message-section")
    })
})
