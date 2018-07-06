$(document).ready(function(){
    var request = $.ajax({
        type: "GET",
        url : "/api/book"
    })
    .done( function(data){
        let OLID_list = []

        $.each(data.data, function(i, item){
            OLID_list.push( item.book_OLID )
        })

        getBookList(OLID_list)
    })
})

function getCover(coverNum){
    var url = "https://covers.openlibrary.org/b/id/"+coverNum+".jpg";
    return url;
}

function getBookList(booklist){
    for (var i = 0; i < booklist.length; i++){
        var OLID = "OLID:" + booklist[i]
        $.ajax({
            type:"GET",
            url:"https://openlibrary.org/api/books?bibkeys=" + OLID + "&jscmd=details&format=json",
            async: false,
            success: function(data) {
                $("<div id='book" + parseInt(i) + "'class='list-group-item list-group-item-action flex-column align-items-start'>").appendTo("#bookCoverAndName")
                $("<div class='row' id = 'box"+ parseInt(i) +"'>").appendTo("#book" + parseInt(i))
                $("<div class='col-lg-5' id='image"+ parseInt(i) +"''>").appendTo("#box"+ parseInt(i))
                // $("<img/>").attr("src",getCover(data[OLID]["details"]["covers"][0]))
                // .attr("width", "200px").attr("height","300px").css({"margin": "0px", "margin-top":"0px", "padding":"0px", "padding-top": "0px",  "margin-bottom":"0px", "padding-bottom":"0px"})
                // .appendTo("#image"+ parseInt(i))
                if (typeof data[OLID]["details"]["covers"] == "undefined"){
                    $("<img/>").attr("src","./images/NoBookCover.jpg")
                    .attr("width", "200px").attr("height","300px").css({"margin": "0px", "margin-top":"0px", "padding":"0px", "padding-top": "0px",  "margin-bottom":"0px", "padding-bottom":"0px"})
                    .appendTo("#image"+ parseInt(i))
                } else {
                    $("<img/>").attr("src",getCover(data[OLID]["details"]["covers"][0]))
                    .attr("width", "200px").attr("height","300px").css({"margin": "0px", "margin-top":"0px", "padding":"0px", "padding-top": "0px",  "margin-bottom":"0px", "padding-bottom":"0px"})
                    .appendTo("#image"+ parseInt(i))
                }

                //$("<div class ='col-lg-5'>").append(data[OLID]["details"]["title"]).css({"font-size": "20px","max-width": "250px",  "padding-left": "35px", "margin-bottom": "0px", "text-align" : "center"}).appendTo("#box"+parseInt(i))

                $("<div class ='col-lg-5' id = 'info" + parseInt(i) +"'>").appendTo("#box"+parseInt(i))
                $("<textarea rows=5 cols=25>").append(data[OLID]["details"]["title"]).css({"font-size": "20px","max-width": "250px",  "padding-left": "25px", "margin-bottom": "0px", "text-align" : "center", "border" : "none"}).appendTo("#info"+parseInt(i))
                $("<button type ='button' data-olid='" + OLID + "' class ='btn btn-danger col-lg-1.5' aria-haspopup='true' aria-expanded='false' id='b"+ parseInt(i) +"'>").text("Delete").appendTo("#box"+parseInt(i))
                $("#b" + parseInt(i)).click(function(){
                    $(this.parentNode.parentNode).remove()
                    $.ajax({
                        type:"DELETE",
                        url:"/api/book/" + $(this).attr("data-olid").split(":")[1]
                    })
                })
            }
        })
    }
}
