'use strict';

var express = require("express");
var MongoDB = require("mongodb");
var MongoClient = MongoDB.MongoClient;
var app = express();
var mongoURL = "mongodb://localhost:27017/fcc_backend";

var findMaxID = { $group: {_id: "maxID", total: { $max: "$id"}}};
var maxID = 0;

function getDatabase() {
  return MongoClient.connect(mongoURL);
}

MongoClient.connect(mongoURL, function (err, database) {
  app.get("/new/:url(*)", function (req, res) {
    var url = req.params.url;
    database.collection("url").find({"url": url}).toArray()
    .then(function (content) {
      if (content.length > 0) {
        console.log(content);
        // We found the URL already, no need to get the damn thing again.
        res.json({"original_url": url, short_url: ("http://localhost:8080/" + content[0].id)});
      } else {
        database.collection("url").aggregate([findMaxID]).toArray()
        .then(function (content) {
          // We don't have this one, need to send a new one back to the user
          // and insert a new row into the DB, which can be true async because
          // who the f cares when it gets done.
          maxID = content[0]["total"] + 1;
          var docInsert = {
            "id": maxID,
            "url": url
          };
          var returnObject = {
            "original_url": url,
            "short_url": ("http://localhost:8080/" + maxID)
          };
          database.collection("url").insert(docInsert, function (err, data) {
            if (err) throw err;
            console.log(data);
          });
          res.json(returnObject);
        })
        .catch(function(err) {
          throw err;
        });
      }
    });
  });

  app.get("/:ID", function(req, res) {
    // Get URL back
    if(isNaN(Number(req.params.ID))) {
      res.json({"error": "This is not a valid entry"});
    } else {
      var idNum = +req.params.ID;
      database.collection("url").find({"id": idNum}).toArray()
      .then(function (content) {
        res.redirect(content[0].url);
      });
    }
  });
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
  console.log('Node.js listening on port ' + port + '...');
});
