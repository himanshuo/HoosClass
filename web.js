var express = require("express");
var logfmt = require("logfmt");
var path = require('path');
var app = express();
var pg = require('pg');
var conString = process.env.DATABASE_URL;
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(logfmt.requestLogger());

app.use(express.static(path.normalize(__dirname) + '/app'));

app.get('/', function(req, res) {

    //res.sendfile('./app/index.html');
    //res.sendfile('./app/scripts/app.js');




});

//ONLY FOR TESTING! MOVE TO SEPERATE IO WHEN DONE
function dostuff(){
pg.connect(conString, function(err, client) {

    if (err) {
        console.log("!!!!!!!!!!!!!!!!!!" + err.message);
        //res.send(err.message);

    } else {
        //console.log(client);
        var q = "select * from alerts";
        var query = client.query(q);
        query.on('row', function(row) {

			console.log(row);
        });
    }
});

}

//io.on('connection', function(socket){
  console.log('a user connected');
  dostuff();
//});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
    //dostuff();
});