var express = require('express');
var router = express.Router();
var fs = require('fs');
var mustache = require('mustache');
var q = require("q");
var _ = require('underscore');
var imgStorePath = __dirname + "/user_images/";

router.get('/', function (req, res) {

  var imgName = req.query['id'],
    img = fs.readFileSync(imgStorePath + imgName);
  res.writeHead(200, {'Content-Type': 'image/gif' });
  res.end(img, 'binary');

});


module.exports = router;
