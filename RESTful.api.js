var mysql   = require("mysql");
var chalk = require('chalk'); // works with "node Server.js" not with "npm start"
var error = chalk.bold.red;
var success = chalk.bold.green;

var St200 = chalk.inverse.green; //OK
var St201 = chalk.inverse.blue; //Created User
var St202 = chalk.inverse.cyan; //No datas ExistingUser
var St204 = chalk.inverse.purple; //No datas
var St400 = chalk.inverse.magenta; //ErrorResponse
var St401 = chalk.inverse.yellow; //Must be connected
var St403 = chalk.inverse.white; //Must be admin
var St404 = chalk.inverse.red; //Not Found ErrorResponse

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5) {
    var self = this;
    router.get("/",function(req,res){
        res.json({"Message" : "Hello API"});
        console.log(chalk.blue("GET - MessageJSON : Hello API"));
    });

    router.get("/users",function(req,res){
        var query = "SELECT * FROM `user`";
        var table = ["user"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : [{"Message" : "Error Must be connected", "401" : "Must be connected"}]});
                console.log(St401("401") +(" : Must be connected"));
                console.log(error("GET - MessageERROR : Error Must be connected"));

            } else {
                res.json({"Success" :[{"Message" : "Success", "User" : rows, "200" : "An array of users"}]});
                console.log(St200("200") + (" : An array of users"));
                console.log(success("GET - MessageSUCCESS : /user"));
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
                res.json({"Error" : [{"Message" : "Error Must be connected", "401" : "Must be connected"}]});
                console.log(St401("401") +(" : Must be connected"));
                console.log(error("GET - MessageERROR : Error Must be connected"));
            }
            else if(rows == "") {
                res.json({"Error" : [{"Message" : "Error User Not Found", "404" : "Not Found ErrorResponse"}]});
                console.log(St404("404") +(" : Not Found ErrorResponse"));
                console.log(error("GET - MessageERROR : Error User Not Found"));
            }
            else {
                res.json({"Success" : [{"Message" : "Success", "User" : rows, "200" : "User definition Object"}]});
                console.log(St200("200") + (" : User definition Object"));
                console.log(success("GET - MessageSUCCESS : /user:id") + "  -->  " + id + rows);
            }
        });
    });

    router.post("/users",function(req,res){
        var Blastname = req.body.lastname;
        var Bfirstname = req.body.firstname;
        var Bmail = req.body.email;
        var Bpassword = req.body.password;
        var Brole = req.body.role;
        var sql = 'INSERT INTO `user`(`lastname`, `firstname`, `email`, `password`, `role`) VALUES (';
        var separator = "'";
        var separators = "','";
        var endquery = "')";
        // "INSERT INTO `user`(`lastname`, `firstname`, `email`, `password`, `role`) VALUES ('Blastname','Bfirstname','Beail','Bpassword','Brole')";
        var query = sql + separator + Blastname + separators + Bfirstname + separators + Bmail + separators + Bpassword + separators + Brole + endquery;
        var table = ["user","lastname","firstname", "email", "password", "role",Blastname,Bfirstname,Bmail,md5(Bpassword),Brole];
        query = mysql.format(query,table);

        connection.query(query,function(err,rows){
            if(err == "Error: Cannot enqueue Query after fatal error.") {
              res.json({"Error" : [{"Message" : "Must be connected, define a role", "401" : "Must be connected"}]});
              console.log(St401("401") + " : Must be connected");
              console.log(error("POST - MessageERROR : Must be connected, define a role"));
            }
            else if(Brole == "admin") {
                res.json({"Error" : [{"Message" : "Error must be admin", "403" : "Must be admin"}]});
                console.log(St403("403") + " : Must be admin");
                console.log(error("POST - MessageERROR : Error must be admin"));
            }
            else if(err) {
            res.json({"Error" : [{"Message" : "ErrorResponse", "400" : "ErrorResponse"}]});
            console.log(St400("400") + " : ErrorResponse");
            console.log(error("POST - ErrorResponse, user already exist or add an email ") + err);
            }
            else {
                res.json({"Success" : [{"Message" : "User Added successfully!", "201" : "Created User"}]});
                console.log(St201("201") + " : Created User");
                console.log(success("POST - MessageSUCCESS : user added successfully"));
            }
        });
    });

    router.put("/user",function(req,res){
        var query = "UPDATE `user` SET `id` = '113' WHERE `user`.`id` = 1";
        var table = ["user","user_password",md5(req.body.password),"user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                console.log(error("PUT - MessageERROR : Error executing MySQL query"));
            } else {
                res.json({"Error" : false, "Message" : "Updated user for email "+req.body.email});
                console.log(success("PUT - MessageSUCCESS : updated user"));
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
                console.log(error("DELETE - MessageERROR : Error executing MySQL query"));
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
                console.log(success("DELETE - MessageSUCCESS : user deleted successfully"));
            }
        });
    });
}

module.exports = REST_ROUTER;
