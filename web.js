var express = require("express");
var logfmt = require("logfmt");
var path = require('path');
var app = express();
var pg = require('pg');
var conString = process.env.DATABASE_URL;
// Create a Socket.IO instance, passing it our server
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log("socket created.");

app.use(logfmt.requestLogger());

app.use(express.static(path.normalize(__dirname) + '/app'));

app.get('/hi', function(req, res) {
//console.log("the / is called ");
    //res.sendfile('./app/index.html');
    //res.sendfile('./app/scripts/app.js');




});


function sendToDB(course, email, phone){
pg.connect(conString, function(err, client) {

    if (err) {
        console.log(err.message);
        //res.send(err.message);

    } else {
        //console.log(client);
        var q = String.format("insert into alerts(last_update, done, class_name, class_num, acronym, class_type, units, num_waitlist, spots, professor, room, status, timing, email, phone) VALUES (now(), false,'{0}','{1}','{2}','{3}','{4}',{5},'{6}','{7}','{8}','{9}','{10}','{11}','{12}');",course.name, course.number, course.acronym, course.classType,course.units, course.spots, course.professor, course.room, course.status, course.timing, email, phone);
        var query = client.query(q);
        query.on('row', function(row) {

			console.log(row);
        });
    }
});

}
//--------------------------------
// Require HTTP module (to start server) and Socket.IO


// Add a connect listener
io.on('connection', function(client){
    
    // Success!  Now listen to messages to be received
    client.on('sendEmails',function(event){
        //console.log('Received message from client!',event);
        console.log(event[0]);
        console.log(event[1]);
        console.log(event[2]);
        sendToDB(event[0], event[1], event[2]);

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



