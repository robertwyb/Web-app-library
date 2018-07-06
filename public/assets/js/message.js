$(document).ready(function(){
    var request = $.ajax({
        type : "GET",
        url : "/api/messages"
    })
    .done(function(data){      
        data = data.data
        $.each(data, function(i, item){                        
            item.msg_time = item.msg_time.split("T")[0] + " " + item.msg_time.split("T")[1].split(".")[0]
            let t = item.msg_time.split(/[- :]/)
            let d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]))

            $("<a href='#' class='list-group-item list-group-item-action flex-column align-items-start' id='delete" + item.msg_id + "'> \
                    <div class='row'> \
                        <div class='col-lg-12'> \
                            <div class='d-flex w-100 justify-content-between'> \
                                <h5 class='mb-1'> Admin Message </h5> \
                                <small> " + d + " </small> \
                            </div> \
                            <p class='mb-1'> " + item.msg_content + " </p> \
                        </div> \
                    </div> \
                </a>").appendTo("#msg-list")
        })
    })  
})