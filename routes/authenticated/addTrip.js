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

  // Add the picture and other information to the
  // database

  var fileName = req.user.UserName + "_" + req.files.placePhoto.name,
    newPath = __dirname + "/user_images/" + fileName;

  fs.writeFile(newPath, req.files.placePhoto.buffer, {'encoding': 'ascii'}, function (err) {
    {
      if (err) {
        res.send(404);
      }
      var conn = CreateSQLConnection(),
        q2 = "insert into UserTrips (UserID, UserName, PlaceName, ImagePath, TripDescription, Coordinates, LikeCount) VALUES('"
          + req.user.UserID + "',"
          + "'" + req.user.UserName + "',"
          + "'" + conn.escape(req.body['placeName']) + "',"
          + "'" + fileName + "',"
          + "'" + conn.escape(req.body['placeDescription']) + "',"
          + "''" + ","
          + "0" + ")";

      conn.query(q2, function (err, rows, fields) {
        if (err) {
          console.log("err = ", err);
          res.send(404);
        }
        res.end();
      });

    }
  });
});

module.exports = router;
