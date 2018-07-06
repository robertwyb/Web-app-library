const express           = require("express")
const bodyParser        = require("body-parser")
const multer            = require("multer")
const path              = require("path")
const http              = require("http")
const methodOverride    = require("method-override")
const cookieParser      = require("cookie-parser")
const session           = require("express-session")
const MySQLStore        = require("express-mysql-session")(session)
const morgan            = require("morgan")
const socketIO          = require("socket.io")
const socketIOHelper    = require("./app/socketio")

const ejs               = require("ejs")

const passport          = require("passport");
const flash             = require("connect-flash")

const app = express()

const port          = 3000
const socket_port   = 4000

const message = require('./app/message');

const sessionKey    = "TeamBulbasaur"
const sessionSecret = "BookBook"

const databaseInfo = require("./config/serverInfo.json").database

const sessionStore = new MySQLStore(databaseInfo)

function initializeServer(app){    
    listenPort(port)
    
    app.set("view engine", "ejs")

    app.use(morgan("dev"))    
    app.use(cookieParser())        
    app.use(methodOverride())

    app.use( bodyParser.json() )
    app.use( bodyParser.urlencoded({
        extended : true
    }))

    // Serve static files
    app.use(express.static(path.join(__dirname, "public")))
    //app.use(express.static(path.join(__dirname, "views")))

    app.use(session({ 
        secret : sessionSecret, 
        resave : false, 
        saveUninitialized: false,
        store : sessionStore
    }))      

    require("./app/routes.js")(app, __dirname)    
        
    // Error Handling
    app.use(function(error, request, response, next){
        console.error(error)
        return response.status(500).json({"data" : "Error has occured"})
    })
}

function isAuthenticated(request, response, next){
    if (request.isAuthenticated())
        return next()

    return response.redirect("/login")
}

function listenPort(port){
    let server = http.Server(app)
    server.listen(port, function(){
        console.log("Server is up and running on port : " + port)
    })

    let io = require('socket.io')(server)
    
    io.on('connection', function(socket){
        message.addSocket(socket)
    });
}

initializeServer(app)

// var socket_server = app.listen(socket_port, function(){
//     console.log("Socket server listening on : " + socket_port)
// })

// var io = socketIO(socket_server)
// socketIOHelper.set(io)
// var receivers = require("./app/sockets/receivers.server.sockets")
// receivers.receivers(io)

