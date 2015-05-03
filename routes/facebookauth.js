/**
 * Created by hassan on 12/27/14.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
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

var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
passport.use(new facebookStrategy({
    clientID: change,
    clientSecret: 'change',
    callbackURL: "http://demo-tourister.rhcloud.com/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, done) {

    console.log("INSIDE CORRECT VERIFICATION..." + accessToken);

    var conn = CreateSQLConnection(),
      query = 'SELECT * FROM Users WHERE SocialNetworkID=' + '\'' + profile.id + '\'',
      d1;

    d1 = q.defer();
    conn.query(query, d1.makeNodeResolver());

    q.all([d1.promise]).then(function (results) {
      console.log("results are below:");
      console.dir(results);

      var found = results[0][0].length === 1,
        q2,
        d2,
        conn2,
        userRecord;

      if (found) {
        console.log("user is found");
        userRecord = results[0][0][0];
        conn.end();
        return done(null, userRecord);
      }
      else {
        console.log("adding as a new user");
        conn2 = CreateSQLConnection();
        q2 = "insert into Users (UserName, SocialNetworkID, SocialNetwork, roleType) VALUES('" + profile.displayName + "'," + profile.id + ",'FB','user')";
        d2 = q.defer();
        console.log(q2);
        conn2.query(q2, d2.makeNodeResolver());

        q.all([d2.promise]).then(function (results) {
          console.log("successfully added & results are : ");
          console.dir(results);
          conn2.end();
          return done(null, {
            UserID: profile.id,
            UserName: profile.name,
            SocialNetworkID: profile.id
          });
        });
      }
    });
  }));

router.get('/', passport.authenticate('facebook'));

router.get('/callback', passport.authenticate('facebook',
  {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
module.exports = router;