var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// Flightaware API
var util = require('util');
var restclient = require('restler');
var fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';
var username = 'tanf91';
var apiKey = 'e81d2f8cf373e02c2f8a83c629b31eb5a252cc2e';

// backlog of coords to be plotted
var coords = [];

// jade
app.set('view engine', 'jade');

// middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// used to get coords from flightaware api
// setInterval(function() {
//     console.log('Getting flight info... %s', new Date());
//     restclient.get(fxml_url + 'GetLastTrack', {
//         username: username,
//         password: apiKey,
//         query: { ident: 'DAL407', howMany: 1 }
//     }).on('success', function(result, response) {
//         fs.writeFileSync('coords.txt', JSON.stringify(result.GetLastTrackResult.data), 'utf8', function(err) {
//             if(err) return console.log(err);
//             console.log('data > coords.txt')
//         });
//     });
// }, 10000);

fs.readFile('coords.txt', 'utf8', function(err, data) {
    if(err) throw err;

    data = JSON.parse(data);
    coords = data;
    console.log(typeof coords);
});

app.get('/', function(req, res) {
    res.render('index', { coords: coords });
});

// assuming incoming data is json and includes lat/long and time fields
app.post('/', function(req, res) {

});

// www
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('connected to websockets');
});

server.listen(3000, function() {
    console.log('listening on port 3000');
});