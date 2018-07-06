process.env.NODE_ENV = 'test'

var chai        = require("chai")
var chaiHttp    = require("chai-http")
var should      = chai.should()
var mocha       = require("mocha")

chai.use(chaiHttp)

var utils = require("../utils")

var server = require("../config/serverInfo.json")
var host = server.api.host + ":" + server.api.port

describe("Endpoint : /api/signup", function(){
    let path = "/auth/signup"
    it("User signs up with proper information", function(done){        
        let data = {
            "username"  : Date.now(),
            "password"  : "password",
            "email"     : Date.now() + "@email.com",
            "name"      : "Test User"            
        }        

        chai.request(host)
            .post(path)
            .set("content-type", "application/x-www-form-urlencoded")
            .send(data)
            .end(function(err, res){
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a("object")
                res.body.should.have.property("data")
                done()
            })
    })

    it("User signs up with missing data", function(done){
        let data = {
            "username"  : "username",
            "password"  : "password",
            "name"      : "Test User"            
        }        

        chai.request(host)
            .post(path)
            .set("content-type", "application/x-www-form-urlencoded")
            .send(data)
            .end(function(err, res){
                res.should.have.status(400)
                res.should.be.json
                res.body.should.be.a("object")
                res.body.should.have.property("data")
                done()
            })
    })

    it("User signs up with duplicate email", function(done){
        let data = {
            "username"  : "username",
            "password"  : "password",
            "email"     : "email@email.com",
            "name"      : "Test User"            
        }        

        chai.request(host)
            .post(path)
            .set("content-type", "application/x-www-form-urlencoded")
            .send(data)
            .end(function(err, res){
                res.should.have.status(400)
                res.should.be.json
                res.body.should.be.a("object")
                res.body.should.have.property("data")
                done()
            })
    })
})

describe("Endpoint : /api/login", function(){
    let path = "/auth/login"
    it("User login with proper information", function(done){
        let data = {
            "username" : "username",
            "password" : "password"
        }

        chai.request(host)
            .post(path)
            .set("content-type", "application/x-www-form-urlencoded")
            .send(data)
            .end(function(err, res){
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a("object")
                res.body.should.have.property("data")
                done()
            })
    })
})

// describe("Endpoint : /api/logout", function(){
//     let path = "/api/logout"
//     it("User logout", function(done){})
// })