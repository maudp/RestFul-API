var mysql   = require("mysql");
var chalk = require('chalk'); // works with "node Server.js" not with "npm start"
var error = chalk.bold.red;

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5) {
    var self = this;
    router.get("/",function(req,res){
        res.json({"Message" : "Hello API"});
        console.log("GET - MessageJSON : Hello API");
    });

    router.get("/user",function(req,res){
        var query = "SELECT * FROM `user`";
        var table = ["user"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                console.log("GET - MessageERROR : Error executing MySQL query");
            } else {
                res.json({"Error" : false, "Message" : "Success", "User" : rows});
                console.log("GET - MessageSUCCESS : /user");
            }
        });
    });

    router.get("/user/:id",function(req,res){
        var id = req.params.id;
        var query = "SELECT * FROM `user` WHERE `id`="+ id;
        var table = ["user","id",id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                console.log("GET - MessageERROR : Error executing MySQL query");
            } else {
                res.json({"Error" : false, "Message" : "Success", "User" : rows});
                console.log("GET - MessageSUCCESS : /user:id");
            }
        });
    });

    router.post("/user",function(req,res){
        var query = "INSERT INTO `user`(`lastname`, `firstname`, `email`, `password`, `role`) VALUES (`lastname`,`firstname`,`email`,`password`,`role`)";
        var table = ["user","lastname","firstname", "email", "password", "role",req.body.email,md5(req.body.password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                console.log("POST - MessageERROR : Error executing MySQL query");
            } else {
                res.json({"Error" : false, "Message" : "User Added successfully!"});
                console.log("POST - MessageSUCCESS : user added successfully");
            }
        });
    });

    router.put("/user",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                console.log("GET - MessageERROR : Error executing MySQL query");
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
                console.log("POST - MessageSUCCESS : updated password");
            }
        });
    });

    router.delete("/user/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login","user_email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                console.log("GET - MessageERROR : Error executing MySQL query");
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
                console.log("POST - MessageSUCCESS : user deleted successfully");
            }
        });
    });
}

module.exports = REST_ROUTER;
