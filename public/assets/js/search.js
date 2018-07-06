$(document).ready(function(){
    var endpoint = "http://openlibrary.org/search.json?"
    var endpoint_bookCover = "http://covers.openlibrary.org/b/isbn/"
    var options = {}
    $("#loading").hide()
    $( "#search-button" ).click(function(){                
        var searchOptions = $( "#search-options" ).val()
        var searchQuery = $( "#search-query" ).val() 

        $(document).ajaxStart(function () {
            $("#loading").show()
            $("#page").fadeTo(0, 0.1)
        }).ajaxStop(function () {
            $("#loading").hide()
            $("#page").css({opacity : 1})
        })
            
        if ( searchOptions == "Title" ){
            options.title = searchQuery
            delete options["author"]
        } else if ( searchOptions == "Author" ){
            options.author = searchQuery
            delete options["title"]
        } 

        var request = $.ajax({
            type: "GET",
            url : endpoint,
            data : options            
        })
        .done(function( data ){
            data = JSON.parse(data)

            var filteredData = filterData(data)

            if ($("#search-title").length != 0){
                $("#search-title").text("Search Results of \'" + searchQuery + "\'")
            } else {
                $( "<p id='search-title'>" ).text("Search Results of \'" + searchQuery + "\'").appendTo("#book-title")
            }       
            
            $('html,body').animate({
                scrollTop: $("#search-title").offset().top},
            'slow')

            if($("#book-result-list").length != 0){
                $("#book-result-list").empty()
            }
            $.each(filteredData, function(i,item){
                var cover = endpoint_bookCover
                if (item.isbn){
                    cover = cover + item.isbn[0] + "-M.jpg"
                } else {
                    cover = "./images/NoBookCover.jpg"
                }
                $("<a href='#' data-target='#modalRegister' data-toggle='modal' class='list-group-item list-group-item-action flex-column align-items-start'>").html(
                    "<div class='row'> \
                    <div class='col-lg-3'> \
                        <img src='" + cover + "' onload='onImageLoad(this)'> \
                    </div> \
                    <div class='col-lg-9'> \
                        <h3 class='mb-1'> " + item.title_suggest + " </h5> \
                        <h6 class='mb-1'> " + item.author_name +" </h3> \
                    </div> \
                    </div>"
                ).appendTo("#book-result-list")      
                .click(function(){     
                    var OLID = "OLID:" + item.edition_key[0]   
                    $(document).ajaxStart(function () {
                      $("#loadingbook").show();
                    }).ajaxStop(function () {
                      $("#loadingbook").hide();
                    });  
                    $.ajax({
                        type:"GET",
                        url:"https://openlibrary.org/api/books?bibkeys="+OLID+"&jscmd=details&format=json",
                        success: function(data) {
                            $("#title").empty()
                            $("#authors").empty()
                            $("#publish").empty()
                            $("#bookCover").empty()
                            $("#description").empty()
                            $("#thePhysicalObject").empty()
                            $("#idNumbers").empty()
                            $("#bookInfo").attr({
                                "data-olid" : ""
                            })
                            $("#title").append(data[OLID]["details"]["title"])

                            if (typeof data[OLID]["details"]["authors"] != "undefined"){
                                $("#authors").append("by "+ data[OLID]["details"]["authors"][0]["name"])
                            }
                            if (typeof data[OLID]["details"]["publish_date"] != "undefined"){
                                $("<h3>").text("Published "+data[OLID]["details"]["publish_date"]
                                    + " by "
                                    + data[OLID]["details"]["publishers"]).appendTo("#publish")
                            }
                            if (typeof data[OLID]["details"]["description"] != "undefined"){
                                $("<h3>").text("About the book").css({"color":"#00636a"}).appendTo("#description")
                                $("<p>").text(data[OLID]["details"]["description"]['value']).appendTo("#description")
                            }
  
                            if (typeof data[OLID]["details"]["number_of_pages"] != "undefined"){
                                $("<h3>").text("The Physical Object").css({"color":"#00636a"}).appendTo("#thePhysicalObject")
                                $("<p>").text("Number of pages " + data[OLID]["details"]["number_of_pages"]).appendTo("#thePhysicalObject")
                            }

                            $("#bookInfo").attr({
                                "data-olid" : OLID
                            })
                            
                            $("<img src='" + cover + "' onload='onModalImageLoad(this)'>")
                            .appendTo("#bookCover")

                            $("<h3>").text("ID Numbers").css({"color":"#00636a"}).appendTo("#idNumbers")
                            $("<p>").text("Open Library " + "\xa0\xa0\xa0\xa0\xa0\xa0"+ OLID.slice(5)).appendTo("#idNumbers")
                            if (typeof data[OLID]["details"]["isbn_10"] != "undefined"){
                                $("<p>").text("ISBN 10" +"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                                    + data[OLID]["details"]["isbn_10"]).appendTo("#idNumbers")
                            }
                            if (typeof data[OLID]["details"]["isbn_13"] != "undefined"){
                                $("<p>").text("ISBN 13" +"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                                    + data[OLID]["details"]["isbn_13"]).appendTo("#idNumbers")
                            }
                        }
                    })
                })          
            })
        })
        .fail(function( error ){
            console.log ( error )
        })      
    })    

    $( "#starbtn" ).click(function(){
        let t = document.getElementById("glyphicon-star-btn").className.split(" ")[2]
        let type = "POST"

        if ( t != "custom-star-inactive"){
            type = "DELETE"
        }

        let r = $.ajax({
            type : type,
            url : "/api/book/" + document.getElementById("bookInfo").getAttribute("data-olid").split(":")[1]
        })
        .done(function(data){
            if (type == "POST") {
                $( "#glyphicon-star-btn" ).removeClass("custom-star-inactive")
                $( "#glyphicon-star-btn" ).addClass("custom-star-active")
            } else {
                $( "#glyphicon-star-btn" ).removeClass("custom-star-active")
                $( "#glyphicon-star-btn" ).addClass("custom-star-inactive")            
            }
        })
    })

    document.querySelector("#search-query").addEventListener("keyup", function(event) {
        if(event.key !== "Enter") return; // Use `.key` instead.
            document.querySelector("#search-button").click(); // Things you want to do.
            event.preventDefault(); // No need to `return false;`.
        });
})

function onImageLoad(img) {    
    if ( img.width < 30 || img.height < 30){
        img.src = "./images/NoBookCover.jpg"        
    }
    img.width = "180"
    img.height = "240"
}

function onModalImageLoad(img){    
    if ( img.width < 30 || img.height < 30){
        img.src = "./images/NoBookCover.jpg"        
    }    
    img.width = "250"
    img.height = "350"
}

function filterData(data){    
    return data.docs.slice(0, 5)
}

function getCover(coverNum){
    var converEndPoint = "https://covers.openlibrary.org/b/id/"
    return converEndPoint + coverNum + ".jpg";
}