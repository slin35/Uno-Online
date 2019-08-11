require('./server_modules/deck');
require('./server_modules/player');
require('./server_modules/database');

// express setup
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var router = express.Router();
var port = 2000;

router.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

router.get('/home', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

router.get('/about', function(req, res){
    res.sendFile(__dirname + '/client/html/about.html');
});

app.use('/', router);
app.use('/client', express.static(__dirname + '/client'));

serv.listen(port);

console.log("Server started.");

// create a deck of 112 cards
var deck = Deck();
deck.initCards();
deck.shuffleCards();



//----------- socket set up ---------------------------------------------//
var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('signIn', function(data){
        Database.isValidPassword(data, function(res){
            if (res){
          
                Player.onConnect(data, socket, deck, SOCKET_LIST);
                socket.emit('signInResponse', {success:true});
                
            }
            else{
                socket.emit('signInResponse', {success:false});
            }
        });
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
        });
    });

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });


});


setInterval(function(){
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        var pack = Player.getPacks();
        socket.emit('deckNum', deck.cards.length);
        socket.emit('init', pack.initPack);
        socket.emit('update', pack.updatePack);
        socket.emit('remove', pack.removedPack);
        socket.emit('lastCard', pack.lastVal);
    }
},1000/25);
