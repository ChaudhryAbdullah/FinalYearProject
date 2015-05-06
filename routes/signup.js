/**
 * Created by hassan on 12/27/14.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var q = require("q");

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
  if (req.isAuthenticated()) {
    res.redirect('/home');
  }
  else {

    var conn = CreateSQLConnection(),
      query = 'SELECT * FROM Users WHERE useremail=' + '\'' + req.body.useremail + '\'',
      d1;

    d1 = q.defer();
    conn.query(query, d1.makeNodeResolver());

    q.all([d1.promise]).then(function (results) {
      var found = results[0][0].length === 1;

      if (found) {
        res.redirect("/login");
      }
      else {
        var conn2 = CreateSQLConnection(),
          userName = req.body.name,
          password = req.body.password,
          email = req.body.useremail,
          q2 = 'insert into Users (UserName, UserPassword, UserEmail, roleType) VALUES("' + userName + '","' + password + '","' + email + '",' + '"user")',
          d2;
        d2 = q.defer();
        conn2.query(q2, d2.makeNodeResolver());
        q.all([d2.promise]).then(function (results) {
          // login the user

          var user = {};
          user.UserID = results[0][0].insertId;
//          user.UserName = userName;
//          user.UserPassword = password;
//          user.UserEmail  = email;

          req.login(user, function (err) {
            res.redirect('/home');
          });

          conn2.end();
        });
      }
      conn.end();
    });
  }
});

router.get('/', function(req, res){
  res.redirect('/');
});

module.exports = router;