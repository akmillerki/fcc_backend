var express = require("express");
var app = express();

app.get("/", function (req, res) {
    var returnObject = {
        "ipaddress": null,
        "language": null,
        "software": null
    };
    var ipaddress = req.headers["x-forwarded-for"];
    var language = req.headers["accept-language"];
    var software = req.headers["user-agent"];
    language = language.substr(0, language.indexOf(","));
    var indexOfFirstParen = software.indexOf("(");
    var indexOfSecondParen = software.indexOf(")");
    software = software.slice(indexOfFirstParen + 1, indexOfSecondParen);
    returnObject.ipaddress = ipaddress;
    returnObject.language = language;
    returnObject.software = software;
    res.send(returnObject);
    
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});