const utils = require("./utils")

exports.addBook = function(request, response, next){
    let param = request.params
    let connection = utils.getConnection()

    let insertQuery = "INSERT INTO `BookLists` SET ?;"
    let data = {
        "user_id" : request.session.user_id,
        "book_OLID" : param.book_OLID
    }
    connection.query(insertQuery, data, function(err, result){
        if (err){
            connection.end()
            return next(err)
        }

        return response.status(200).json({
            "data" : ""
        })
    })
}

exports.deleteBook = function(request, response, next){
    let param = request.params
    let connection = utils.getConnection()
    
    console.log(param)

    let deleteQuery = "DELETE FROM `BookLists` WHERE user_id = ? AND book_OLID = ?;"
    connection.query(deleteQuery, [request.session.user_id, param.book_OLID], function(err, result){
        if (err){
            connection.end()
            return next(err)
        }

        return response.status(200).json({
            "data" : ""
        })
    })
}

exports.getBookList = function(request, response, next){
    let param = request.param
    let connection = utils.getConnection()

    let selectQuery = "SELECT * FROM `BookLists` WHERE user_id = ? ORDER BY created DESC;"
    connection.query(selectQuery, [request.session.user_id], function(err, result){
        if (err){
            connection.end()
            return next(err)
        }

        console.log(result)

        return response.status(200).json({
            "data" : result
        })
    })
}