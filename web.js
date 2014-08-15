var express = require("express");
var logfmt = require("logfmt");
var path = require('path');
var app = express();
var pg = require('pg');
var conString = process.env.DATABASE_URL;


app.use(logfmt.requestLogger());

app.use(express.static(path.normalize(__dirname) + '/app'));

app.get('/hi', function(req, res) {
console.log("the / is called ");
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
//--------------------------------
// Require HTTP module (to start server) and Socket.IO

var http = require('http').Server(app);
var io = require('socket.io')(http);
// Create a Socket.IO instance, passing it our server

console.log("socket created.");
// Add a connect listener
io.on('connection', function(client){
    
    // Success!  Now listen to messages to be received
    client.on('sendEmails',function(event){
        console.log('Received message from client!',event);
        console.log("name:"+ event.email);
    });
    client.on('disconnect',function(){
        
        console.log('Server has disconnected');
    });

});
//---------------------------------

/*var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
    //dostuff();
});*/

var port = Number(process.env.PORT || 5000);
http.listen(port, function() {
    console.log("Listening on " + port);
    //dostuff();
});



