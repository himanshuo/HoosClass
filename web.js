var express = require("express");
var logfmt = require("logfmt");
var path = require('path');
var app = express();
app.use(logfmt.requestLogger());

app.use(express.static(path.normalize(__dirname) + '/app'));

app.get('/', function(req, res) {

	//res.sendfile('./app/index.html');
	//res.sendfile('./app/scripts/app.js');
	
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
