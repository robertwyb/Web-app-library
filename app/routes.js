module.exports = function(app, directory){
    app.get("/", function(request, response){     
        console.log( request.session.user_id )
        response.render("index.ejs", {
            isLoggedIn : request.session.user_id != undefined ? true : false
        })                
    })

    app.get("/signup", function(request, response){
        response.sendFile(directory + "/views/signup.html")
    })

    app.get("/login", function(request, response){
        response.sendFile(directory + "/views/login.html")
    })

    app.get("/books", isAuthenticated ,function(request, response){
        response.sendFile(directory + "/views/books.html")
    })

    app.get("/messages", isAuthenticated, function(request, response){
        response.sendFile(directory + "/views/messages.html")
    })

    app.get("/password", isAuthenticated, function(request, response){
        response.sendFile(directory + "/views/password.html")
    })

    app.get("/logout", isAuthenticated, function(request, response){
        request.logout()
        response.rediect("/")
    })

    /* ================= API ================= */

    let user    = require("./user")
    let book    = require("./book")
    let message = require("./message")    

    app.post("/auth/signup", user.signup)
    app.post("/auth/login", user.login)
    app.post("/auth/status", user.getStatus)

    app.put("/auth/password", user.changePassword)
    app.get("/auth/logout", user.logout)

    app.get("/api/messages", message.getMessage)
    app.post("/api/messages", message.sendMessage)
    app.delete("/api/messages/:msg_id", message.deleteMessage)
    
    app.get("/api/book", isAuthenticated, book.getBookList)
    app.post("/api/book/:book_OLID", isAuthenticated, book.addBook)
    app.delete("/api/book/:book_OLID", isAuthenticated, book.deleteBook)
}

function isAuthenticated(request, response, next){    
    if (request.session.user_id === undefined){
        response.redirect("/login")
    } else {
        return next()
    }
}