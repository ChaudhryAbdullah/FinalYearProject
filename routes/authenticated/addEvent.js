var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var router = express.Router();
var mysql = require('mysql');
var q = require("q");
var constants = require('../../server/constants');
var _ = require('underscore');


function CreateSQLConnection() {
  var connection = mysql.createConnection({
    host: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
    user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
    port: 3306,
    password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'password',
    database: process.env.OPENSHIFT_MYSQL_DB_HOST ? 'demo' : 'Tourister',
    multipleStatements: true
  });

  connection.connect();
  return connection;
}

router.post('/', function (req, res) {

 var conn = CreateSQLConnection(),
        q2 = "insert into UserEvents (UserID, UserName, EventName, EventDescription, EventTime) VALUES('"
          + req.user.UserID + "',"
          + "'" + req.user.UserName + "',"
          + "'" + req.body['EventName'] + "',"
          + "'" + req.body['EventDescription'] + "',"
            + "'" + req.body['eventTime'] + "')";

            console.log(q2);
             conn.query(q2, function (err, rows, fields) {
                    if (err) {
                      console.log("err = ", err);
                      res.send(404);
                    }
                    res.end();
                  });



  });


router.get('/', function (req, res) {

  var conn = CreateSQLConnection(),
    q2 = "select * from UserEvents;";

  conn.query(q2, function (err, rows, fields) {
    if (err) {
      console.log("err = ", err);
      res.send(404);
    }
    res.end();
  });



});

module.exports = router;
