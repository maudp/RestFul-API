var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./RESTful.api.js");
var app  = express();
var chalk = require('chalk'); // works with "node Server.js" not with "npm start"
var error = chalk.bold.red;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'tcm_rest',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log(chalk.yellow("All right ! I am alive at Port") + chalk.bold.yellow(" 3000."));
      });
}

REST.prototype.stop = function(err) {
    console.log(error("ISSUE WITH MYSQL \n" + err));
    process.exit(1);
}

new REST();
