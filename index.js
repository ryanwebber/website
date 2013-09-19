var express = require("express");
var fs = require('fs');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
        var html = fs.readFileSync('index.html').toString();
	response.send(html);
});
app.use("/css", express.static(__dirname + '/css'));
app.use("/", express.static(__dirname + '/'));
var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});