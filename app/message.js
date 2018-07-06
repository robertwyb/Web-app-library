const utils = require("./utils")

var sockets = [];

exports.addSocket = function(socket){
    sockets.push(socket);
};

exports.getMessage = function(request, response, next){
    let connection = utils.getConnection()

    connection.connect(function(err){
        if (err){
            connection.end()
            return next(err)
        }

        let selectQuery = "SELECT * FROM `Messages` ORDER BY msg_time DESC;"
        connection.query(selectQuery, function(err, result){
            if (err){
                connection.end()
                return next(err)
            }

            return response.status(200).json({
                "data" : result
            })
        })
    })
}

exports.sendMessage = function(request, response, next){
    let param = request.body
    let connection = utils.getConnection()

    connection.connect(function(err){
        if (err){
            connection.end()
            return next(err)
        }

        let insertQuery = "INSERT INTO `Messages` SET ?;"
        let data = {
            "msg_title" : "Admin Message",
            "msg_content" : param.data
        }
        connection.query(insertQuery, data, function(err, result){
            if (err){
                connection.end()
                return next(err)
            }

            sockets.forEach(socket => {
                socket.emit('push', {'data' : param.data});
            });
            return response.status(200).json({
                "status" : "sent",
                "data" : ""
            })
        })
    })
}

exports.deleteMessage = function(request, response, next){
    let param = request.params
    let connection = utils.getConnection()

    connection.connect(function(err){
        if (err){
            connection.end()
            return next(err)
        }

        let deleteQuery = "DELETE FROM `Messages` WHERE msg_id = ?;"
        connection.query(deleteQuery, [param.msg_id], function(err, result){
            if (err){
                connection.end()
                return next(err)
            }

            return response.json({"status" : "deleted", "data" : ""})
        })
    })
}