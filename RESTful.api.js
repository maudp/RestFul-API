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
        console.log(chalk.blue("GET - MessageJSON : Hello welcome to Maud's RESTful - API"));
    });

    router.get("/users",function(req,res){
        var query = "SELECT * FROM `user`";
        var table = ["user"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                reponse = {"Error" : [{"Message" : "Error Must be connected", "401" : "Must be connected"}]};
                status = St401("401") +(" : Must be connected");
                get = error("GET - MessageERROR : Error Must be connected");

            } else {
                reponse = {"Success" :[{"Message" : "Success", "User" : rows, "200" : "An array of users"}]};
                status = St200("200") + (" : An array of users");
                get = success("GET - MessageSUCCESS : /user");
            }
            res.json(reponse);
            console.log(status);
            console.log(get);
        });
    });

    router.get("/user/:id",function(req,res){
        var id = req.params.id;
        var query = "SELECT * FROM `user` WHERE `id`="+ id;
        var table = ["user","id",id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                reponse = {"Error" : [{"Message" : "Error Must be connected", "401" : "Must be connected"}]};
                status = St401("401") +(" : Must be connected");
                getid = error("GET - MessageERROR : Error Must be connected");
            }
            else if(rows == "") {
                reponse = {"Error" : [{"Message" : "Error User Not Found", "404" : "Not Found ErrorResponse"}]};
                status = St404("404") +(" : Not Found ErrorResponse");
                getid = error("GET - MessageERROR : Error User Not Found");
            }
            else {
                reponse = {"Success" : [{"Message" : "Success", "User" : rows, "200" : "User definition Object"}]};
                status = St200("200") + (" : User definition Object");
                getid = success("GET - MessageSUCCESS : /user/:id") + "  -->  " + id;
            }
            res.json(reponse);
            console.log(status);
            console.log(getid);
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
        if(Brole == "admin") {
            res.json({"Error" : [{"Message" : "Error must be admin", "403" : "Must be admin"}]});
            console.log(St403("403") + " : Must be admin");
            console.log(error("POST - MessageERROR : Error must be admin"));
            var query = false;
            return query;

        }
        else{
          var query = sql + separator + Blastname + separators + Bfirstname + separators + Bmail + separators + Bpassword + separators + Brole + endquery;
          var table = ["user","lastname","firstname", "email", "password", "role",Blastname,Bfirstname,Bmail,md5(Bpassword),Brole];
          query = mysql.format(query,table);

          connection.query(query,function(err,rows){
              if(err == "Error: Cannot enqueue Query after fatal error.") {
                reponse = {"Error" : [{"Message" : "Must be connected, define a role", "401" : "Must be connected"}]};
                status = St401("401") + " : Must be connected";
                post = error("POST - MessageERROR : Must be connected, define a role");
              }
              else if(err) {
              reponse = {"Error" : [{"Message" : "ErrorResponse", "400" : "ErrorResponse"}]};
              status = St400("400") + " : ErrorResponse";
              post = error("POST - ErrorResponse, user already exist or add an email ") + err;
              }
              else {
                  reponse = {"Success" : [{"Message" : "User Added successfully!", "201" : "Created User"}]};
                  status = St201("201") + " : Created User";
                  post = success("POST - MessageSUCCESS : user added successfully");
              }
              res.json(reponse);
              console.log(status);
              console.log(post);
          });
        }


    });

    router.put("/user/:id",function(req,res){
      var id = req.params.id;
      var Blastname = req.body.lastname;
      var Bfirstname = req.body.firstname;
      var Bmail = req.body.email;
      var Bpassword = req.body.password;
      var Brole = req.body.role;
      var sqllast = "UPDATE `user` SET `lastname` = '";
      var sqlfirst = "UPDATE `user` SET `firstname` = '";
      var sqlmail = "UPDATE `user` SET `email` = '";
      var sqlpass = "UPDATE `user` SET `password` = '";
      var sqlrole = "UPDATE `user` SET `role` = '";
      var where = " WHERE `user`.`id` = ";
      var endquery = "'";

      if(Brole == "admin") {
          res.json({"Error" : [{"Message" : "Error must be admin", "403" : "Must be admin"}]});
          console.log(St403("403") + " : Must be admin");
          console.log(error("POST - MessageERROR : Error must be admin"));
          var query = false;
          return query;
      }
      else{
        //UPDATE `user` SET `email` = 'jadey@mail.fr' WHERE `user`.`id` = 10
        if(Bmail !== undefined) {
            // case where email needs to be updated.
            var queryMail = sqlmail + Bmail + endquery + where + id + ";\n";
        }
        else {
          var queryMail = "";
        }

        if(Bpassword !== undefined) {
            // case where password needs to be updated
            var queryPass = sqlpass + Bpassword + endquery + where + id + ";\n";
        }
        else {
          var queryPass = "";
        }

        if(Blastname !== undefined) {
            // case where password needs to be updated
            var queryLast = sqllast + Blastname + endquery + where + id + ";\n";
        }
        else {
          var queryLast = "";
        }

        if(Bfirstname !== undefined) {
            // case where password needs to be updated
            var queryFirst = sqlfirst + Bfirstname + endquery + where + id + ";\n";
        }
        else {
          var queryFirst = "";
        }

        if(Brole !== undefined) {
            // case where password needs to be updated
            var queryRole = sqlrole + Brole + endquery + where + id + ";\n";
        }
        else {
          var queryRole = "";
        }

        var query = queryMail + queryPass + queryLast + queryFirst + queryRole;

        var query = query;
        console.log(query);
        var table = ["user","lastname","firstname", "email", "password", "role",Blastname,Bfirstname,Bmail,md5(Bpassword),Brole];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
          if(rows == "undefined" || rows == ""){
            reponse = {"Error" : [{"Message" : "Error User Not Found", "404" : "Not Found ErrorResponse"}]};
            status = St404("404") +(" : Not Found ErrorResponse") + id;
            put = error("PUT - MessageERROR : Error User Not Updated");
          }

          else if(err == "Error: Cannot enqueue Query after fatal error.") {
            reponse = {"Error" : [{"Message" : "Must be connected, define a role", "401" : "Must be connected"}]};
            status = St401("401") + " : Must be connected";
            put = error("PUT - MessageERROR : Must be connected, define a role");
          }
          else if(err) {
            reponse = {"Error" : [{"Message" : "Error updating data", "202" : "No datas ExistingUser"}]};
            put = error("PUT - MessageERROR : Error executing MySQL query \n" + err);
            status = St202("202") + " : No datas ExistingUser" + rows;
          }
          else {
            reponse = {"Error" : [{"Message" : "Data is updated", "User" : rows, "200" : "User definition Object"}]};
            put = success("PUT - MessageSUCCESS : Data is updated ");
            status = St200("200") + " : Data is updated ";

          }
          res.json(reponse);
          console.log(status);
          console.log(put);
      });
      }
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
