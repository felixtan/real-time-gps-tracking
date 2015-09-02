var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// jade
app.set('view engine', 'jade');

// middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res) {
    res.render('index');
});

// assuming incoming data is json and includes lat/long and time fields
app.post('/', function(req, res, next) {
    var d = new Date();
    var coord = {
        'time': req.body.time || d.getTime(),
        'lat': req.body.lat,
        'long': req.body.long
    };
    io.sockets.emit('reading', coord);
    res.send({});
});

var port = process.env.PORT || 3000;
server.listen(port);