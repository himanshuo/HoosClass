var express = require("express");
var logfmt = require("logfmt");
var path = require('path');
var app = express();
var pg = require('pg');
var conString = process.env.DATABASE_URL;

app.use(logfmt.requestLogger());

app.use(express.static(path.normalize(__dirname) + '/app'));

app.get('/', function(req, res) {

    //res.sendfile('./app/index.html');
    //res.sendfile('./app/scripts/app.js');

});

pg.connect(conString, function(err, client) {

    if (err) {
        console.log("!!!!!!!!!!!!!!!!!!" + err.message);
        //res.send(err.message);

    } else {
        //console.log(client);
        var q = "select * from alerts where done=false";
        var query = client.query(q);
        query.on('row', function(row) {

			console.log(row);
        });
    }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});