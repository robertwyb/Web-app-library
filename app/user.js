const utils = require("./utils")

exports.signup = function(request, response, next){
    let param = request.body
    let connection = utils.getConnection()

    connection.connect(function(err){
        if (err){
            connection.end()
            return next(err)
        }

        if (param.username == undefined || param.password == undefined || param.email == undefined)
            return response.status(400).json({"data" : "No Data"})

        let insertQuery = "INSERT INTO `Users` SET ?"
        let data        = {
            "username"  : param.username,
            "password"  : utils.hashPassword(param.password),
            "email"     : param.email
        }        
        connection.query(insertQuery, data, function(err, result){
            if (err){
                connection.end()
                if (err.code != "ER_DUP_ENTRY"){                    
                    return next(err)
                } else {
                    return response.status(400).json({"data" : ""})
                }                
            }

            connection.end()
            return response.redirect("/login")
        })        
    })
}

exports.login = function(request, response, next){
    let param = request.body
    let connection = utils.getConnection()

    connection.connect(function(err){
        if(err){
            connection.end()
            return next(err)
        }

        param.password = utils.hashPassword(param.password)
        let selectQuery = "SELECT user_id, username, email, created FROM `Users` WHERE username = ? AND password = ?;"
        let data = [param.username, param.password]
        connection.query(selectQuery, data, function(err, result){
            if (err){
                connection.end()
                return next(err)   
            }

            let responseData = {
                "data" : []
            }

            if (result.length == 1){
                responseData.data = result[0]
                request.session.user_id = result[0].user_id
            }            

            connection.end()
            return response.json(responseData)
        })
    })
}

exports.logout = function(request, response, next){
    delete request.session.user_id

    request.session.destroy(function(err){
        if (err){
            return next(err)
        }
        
        request.logout()
        return response.redirect("/")        
    })
}

exports.changePassword = function(request, response, next){
    let param = request.body
    let connection = utils.getConnection()

    connection.connect(function(err){
        if (err){
            connection.end()
            return next(err)
        }

        param.currentPassword = utils.hashPassword(param.currentPassword)
        let selectQuery = "SELECT * FROM `Users` WHERE user_id = ? AND password = ?;"
        connection.query(selectQuery, [request.session.user_id, param.currentPassword], function(err, result){
            if (err){
                connection.end()
                return next(err)
            }

            if (result.length == 0){
                connection.end()
                return response.status(200).json({"status" : "incorrect password", "data" : ""})
            } else {
                let updateQuery = "UPDATE `Users` SET ? WHERE user_id = ?;"
                let updateData = {
                    "password" : utils.hashPassword(param.newPassword)
                }
                connection.query(updateQuery, [updateData, request.session.user_id], function(err, result){
                    if (err){
                        connection.end()
                        return next(err)
                    }
                    
                    connection.end()
                    return response.status(200).json({"status" : "updated"})
                })
            }
        }) 
    })
}

exports.getStatus = function(request, response, next){
    if (request.session.user_id){
        return response.json({"data" : request.session.user_id})
    } else {
        return response.json({"data" : ""})
    }
}

exports.isAuthenticated = function(request, response, next){
    if (request.session.user_id){
        return next()
    } else {
        return response.redirect("/login")
    }
}