var express = require("express");
var moment = require("moment");
var app = express();

app.get("/:TIME", function (req, res) {
    var returnObject = {
        "unix": null,
        "natural": null
    };
    var param = req.params.TIME;
    var date = moment(param, ["MMMM DD, YYYY", "X"]);
    if (date.isValid()) {
        returnObject.natural = date.format("MMMM DD, YYYY");
        returnObject.unix = date.format("X");
        res.send(returnObject);
    } else {
        res.send(returnObject);
    }
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});