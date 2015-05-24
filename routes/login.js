/**
 * Created by hassan-MBP on 8/13/14.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
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

passport.use(new localStrategy(
  function (useremail, password, done) {

    var conn = CreateSQLConnection(),
      query = 'SELECT * FROM Users WHERE useremail=' + '\'' + useremail + '\'',
      d1;

    d1 = q.defer();
    conn.query(query, d1.makeNodeResolver());

    q.all([d1.promise]).then(function (results) {
      var found = results[0][0].length === 1,
        userRecord;

      if (found) {
        userRecord = results[0][0][0];

        if (userRecord.UserPassword === password) {
          return done(null, userRecord);
        }
        return done(null, false, {message: 'Incorrect Login Credentials'});
      }
      else {
        return done(null, false, {message: 'Incorrect Login Credentials'});
      }
      conn.end();
    });
  }
));

passport.serializeUser(function (user, done) {

  console.log("CALLED SERAILZE here " + user.UserID);
  console.dir(user);

  // Serialize the user for session

  done(null, user)
});

passport.deserializeUser(function (user, done) {

  // Grab the user record from the session
  done(null, user);
  console.log("CALLED DESERAILZE here ");

});

router.post('/', passport.authenticate('local',
  { successRedirect: '/home',
    failureRedirect: '/' }));

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  }
  else {
    res.sendfile("./views/login.html");
  }
});

module.exports = router;