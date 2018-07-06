const crypto 	= require("crypto")
const mysql 	= require("mysql")

const dbinfo 	= require("../config/serverInfo.json").database

const hashKey 	= "Book"

exports.getConnection = function(){
	dbinfo.multipleStatements = true

	return mysql.createConnection(dbinfo)	
}

exports.hashPassword = function(password){
	return crypto.createHmac("sha256", password)
                   .update(hashKey)
                   .digest("hex")
}

