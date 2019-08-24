require('./server_modules/database')
require('./server_modules/room')

// set up express
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var router = express.Router();

router.get('/', function(req, res){
    res.sendFile(__dirname + '/client/html/index.html');
});

router.get('/about', function(req, res){
    res.sendFile(__dirname + '/client/html/about.html');
});

app.use('/', router);
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT);

console.log("Server started.");

// set up socket
var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('signIn', function(data){
        Database.isValidPassword(data, function(res){
            if (res){
                Room.onConnect(data, socket, SOCKET_LIST);
                socket.emit('signInResponse', {success:true});
            }
            else {
                socket.emit('signInResponse', {success:false});
            }
        })
    });

    socket.on('signUp', function(data){
        Database.isUsernameTaken(data, function(res){
            if (res){
                socket.emit('signUpResponse', {success:false});
            }
            else {
                Database.addUser(socket, data, function(){
                    socket.emit('signUpResponse', {success:true});
                });
            }
        })
    });

    socket.on('disconnect',function(){
        Room.onDisconnect(socket);
        delete SOCKET_LIST[socket.id];
    }); 


});


setInterval(function(){
    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newRoom', Room.list);
    }
}, 1000/25)