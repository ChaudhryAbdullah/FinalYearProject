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

function GetSQL(tags, page, res, req) {
  var response = {},
    connection = CreateSQLConnection(),
    i = 0,
    query = 'SELECT QuestionID, QuestionMarkup, DifficultyRank, Tags, OneLiner FROM table1' + (req.user.status != 'admin' ? ' WHERE status="release"' : ''),
    q2 = 'SELECT count(*) FROM table1' + (req.user.status != 'admin' ? ' WHERE status="release"' : '');

  // Add filter by tags criteria
  for (; i < tags.length; i++) {
    if (i === 0) {
      query += ' WHERE '
      q2 += ' WHERE';
    }
    else {
      query += ' OR ';
      q2 += ' OR';
    }

    query += 'Tags LIKE ' + '\'%' + tags[i] + '%\'';
    q2 += 'Tags LIKE ' + '\'%' + tags[i] + '%\'';
  }

  // Limit by the number of results shown per page
  if (pageSize) {
    query += " LIMIT " + pageSize * (page) + ", " + pageSize;
  }

  var d1 = q.defer(),
    d2 = q.defer(),
    q1 = connection.query(query, d1.makeNodeResolver()),
    q2 = connection.query(q2, d2.makeNodeResolver());

  q.all([d1.promise, d2.promise]).then(function (results) {
    var rowsCopy = [],
      rows = results[0][0];
    i = 0;

    //TODO: check if we need the rowscopy or not
    console.log('rows count returned = ', rows.length);
    for (; i < rows.length; i++) {
      var item = {};
      item.QuestionID = rows[i].QuestionID;
      var markup = rows[i].QuestionMarkup;
      item.QuestionMarkup = (new Buffer(markup)).toString('utf-8');
      item.DifficultyRank = rows[i].DifficultyRank;
      item.Tags = rows[i].Tags;
      item.OneLiner = rows[i].OneLiner;

      rowsCopy.push(item);
    }

    response.Questions = rowsCopy;
    response.TotalResults = results[1][0][0]["count(*)"];
    connection.end(function (err) {
      if (err) {
        console.error("connection terminated badly ");
        console.dir(err);
      }
    });

    console.log("sending to client list = " + JSON.stringify(response));
    res.send(JSON.stringify(response));
    res.end();
  });
}

function GetQuestion(res, qid) {

  var connection = CreateSQLConnection(),
    query = "SELECT * FROM table1 WHERE QuestionID=" + qid + ";" +
      "SELECT * FROM Illustrations WHERE QuestionID=" + qid + ";";

  connection.query(query, function (err, rows, fields) {
    if (err) {
      throw err;
    }

    var question = rows[0][0],
      illustrations = rows[1];

    var item = {};
    item.QuestionID = question.QuestionID;
    var markup = question.QuestionMarkup;
    item.QuestionMarkup = (new Buffer(markup)).toString('utf-8');

    markup = question.SolutionMarkup;
    item.SolutionMarkup = (new Buffer(markup)).toString('utf-8');

    var missingCodeMessage = "<h3 style='width: 100%; text-align: center'>Ah, bummer ! we haven't been able to get to write out this code yet. </h3>";
    item.JavascriptCode = missingCodeMessage;
    item.CSharpCode = missingCodeMessage;
    item.JavaCode = missingCodeMessage;

    markup = question.JavascriptCode;
    if (markup) {
      item.JavascriptCode = (new Buffer(markup)).toString('utf-8');
    }

    markup = question.JavaCode;
    if (markup) {
      item.JavaCode = (new Buffer(markup)).toString('utf-8');
      item.JavaCode = _.isEmpty(item.JavaCode) ? missingCodeMessage : item.JavaCode;
    }

    markup = question.CSharpCode;
    if (markup) {
      item.CSharpCode = (new Buffer(markup)).toString('utf-8');
      item.CSharpCode = _.isEmpty(item.CSharpCode) ? missingCodeMessage : item.CSharpCode;
    }

    item.DifficultyRank = question.DifficultyRank;
    item.ExplanationQuality = question.ExplanationQuality;
    item.Tags = question.Tags;
    item.OneLiner = question.OneLiner;

    // Dummy data for d3 starts
    var arr = [];

    arr[0] = "";

    item.SVG = arr;

  });
}

function RenderLandingPage(req, res) {
  var r = fs.readFileSync('views/index.mustache', {encoding: 'utf-8'}),
    head = fs.readFileSync('views/head.mustache', {encoding: 'utf-8'});

  r = mustache.to_html(r,
    {user: {
      userName: '' //req.user.UserName
    }},
    {
      head: head
    });

  res.setHeader('content-type', 'text/html')
  res.write(r);
  res.end();

}

router.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    RenderLandingPage(req, res);
  }
});

router.get('/', function (req, res) {
  res.redirect('/home');
});

router.get('/home', function (req, res) {

  var home = fs.readFileSync('views/home.mustache', {encoding: 'utf-8'}),
    navBar = fs.readFileSync('views/navbar.mustache', {encoding: 'utf-8'}),
    head = fs.readFileSync('views/head.mustache', {encoding: 'utf-8'}),
    rightBar = fs.readFileSync('views/rightbar.mustache', {encoding: 'utf-8'}),
    leftBar = fs.readFileSync('views/leftbar.mustache', {encoding: 'utf-8'}),
    newsfeed = fs.readFileSync('views/newsfeed.mustache', {encoding: 'utf-8'}),
    serverdata = fs.readFileSync('views/serverdata.mustache', {encoding: 'utf-8'}),
    suggestedPlaces = fs.readFileSync('views/suggestedPlaces.mustache', {encoding: 'utf-8'}),
    addTripForm = fs.readFileSync('views/addTripForm.mustache', {encoding: 'utf-8'}),
    addEventForm = fs.readFileSync('views/addEventForm.mustache', {encoding: 'utf-8'});


  var serverdataScript = mustache.to_html(serverdata, {userJSON: JSON.stringify(req.user)});

  home = mustache.to_html(home,
    {user: {
      userName: req.user.UserName
    }},
    {
      navbar: navBar,
      head: head,
      addTripForm: addTripForm,
      addEventForm:addEventForm,
      newsfeed: newsfeed,
      suggestedPlaces: suggestedPlaces,
      rightbar: rightBar,
      serverdata: serverdataScript,
      leftbar: leftBar
    });

  res.setHeader('content-type', 'text/html')
  res.write(home);
  res.end();

});

router.get('/newsfeed', function (req, res) {

  var connection = CreateSQLConnection(),
    requestPage = req.query.page ? req.query.page : 0,
//    query = "SELECT * FROM UserTrips WHERE UserID !=" + req.user.UserID + " LIMIT " + requestPage * constants.pageSize + "," + constants.pageSize + ";",
    query = "SELECT * FROM UserTrips LIMIT " + requestPage * constants.pageSize + "," + constants.pageSize + ";";

  connection.query(query, function (err, rows, fields) {
    if (err) {
      // send appropriate error
    }
    else {
      res.send(rows);
    }
    res.end();
    connection.end();
  });
});

router.get('/suggestedplaces', function (req, res) {

  var connection = CreateSQLConnection(),
    query = "SELECT * FROM Places";

  connection.query(query, function (err, rows, fields) {
    if (err) {
      // send appropriate error
    }
    else {
      res.send(rows);
    }
    res.end();
    connection.end();
  });

});


router.get('/UserEvents', function (req, res) {

  var connection = CreateSQLConnection(),
    query = "SELECT * FROM UserEvents";

  connection.query(query, function (err, rows, fields) {
    if (err) {
      // send appropriate error
    }
    else {
      res.send(rows);
    }
    res.end();
    connection.end();
  });

});



router.post('/user', function (req, res) {

  // Update the user's liked places
  var conn = CreateSQLConnection(),
    query = "UPDATE Users SET LikedPlaces='" + req["body"].LikedPlaces + "' WHERE UserID =" + req.user.UserID;

  conn.query(query, function (err, rows, fields) {
    if (err) {
      // Send appropriate error message
    }

    // Also update in session
    req.user.LikedPlaces = req["body"].LikedPlaces;

    res.end();
    conn.end();
  });


});


router.get('/list', function (req, res) {
  var tags = req.query.tags ? req.query.tags.split(",") : [];
  var requestPage = req.query.page ? req.query.page : 0;
  GetSQL(tags, requestPage, res, req);
});

module.exports = router;
