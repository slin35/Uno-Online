require('./deck');

//------------ player class ---------------------------------------------//
Player = function(id, username, deck) {
    var self = {
        id: id,
        username: username,
        cards: deck.dealCards(7),
        cardPlayed: -1,
        room: -1,
        deck: deck
    }

    self.updateCards = function(num){
        self.cards.splice(self.cards.indexOf(num), 1);
    }

    self.getPack = function(){
        return {
            id: self.id,
            username: self.username,
            cards: self.cards,
            room: self.room,
            deck: self.deck
        };
    }

    Player.list[id] = self;

    return self;
}

Player.list = {};

Room = {};


//--------- player socket connection ------------------------------------//
var val, lastVal = -1;
var playerNum = 0;

Player.onConnect = function(data, socket, deck, SOCKET_LIST){
    var player = new Player(socket.id, data.username, deck);

    socket.on('enterRoom', function(data){
        if (Room[data]){
            player.room = data;
            socket.emit('enterRoomResponse', {state:true});
            socket.emit('init', {
                selfRoom: data,
                player: Player.getAllPack()
            })
            
        }
        else {
            socket.emit('enterRoomResponse', {state:false});
        }

    });

    socket.on('createRoom', function(data){
        playerNum = data;
        var room = parseInt(("" + socket.id).slice(2,7), 10);
        player.room = room;
        Room[room] = {numPlayer: data};

        socket.emit('init', {
            selfRoom: room,
            player: Player.getAllPack()
        })
        
    });

    
    initPack.player.push(player);

        
    socket.emit('init', {
        selfId: socket.id,
        player: Player.getAllPack()
    })

    play_order.push(player.id);
    


    socket.on('play', function(data){

        val = lastVal;

        if (data.cardVal > 0){
            player.updateCards(data.cardVal);
            player.cardPlayed = data.cardVal;
            updatePack.player.push(player);
        }

        lastVal = data.cardVal;
    });

    socket.on('sendMsgToServer', function(data){
        var playerName = data.username;
        var chatInput = data.input;
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ': ' + chatInput);
        }
    });


    socket.on('sendPmToServer', function(data){
        var recipientSocket = null;
        for (var i in Player.list)
            if (Player.list[i].username === data.username)
                recipientSocket = SOCKET_LIST[i];
        if (recipientSocket === null){
            socket.emit('addToChat', 'The player '+data.username+' is not online.');
        } 
        else{
            recipientSocket.emit('addToChat', 'From ' + player.username + ': ' + data.message);
            socket.emit('addToChat', 'To ' + data.username + ': ' + data.message);
        }
    });

    

 /*   socket.on('play_request', function(data){
        if (index == playerNum)
            index = 0;
        if (Player.list[index] == data){
            socket.emit('play_response', {state: true});
            index ++;
        }
        else
            socket.emit('play_response', {state: false});
    }); */
}

Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
    removedPack.player.push(socket.id);
}

Player.getAllPack = function(){
    var players = [];
    for (var i in Player.list)
        players.push(Player.list[i].getPack());
    return players;
}

// ---------- order of playing ------------------------------------------//
var play_order = [];
var index = 0;

var initPack = {player: []};
var updatePack = {player: []};
var removedPack = {player: []};


Player.getPacks = function(){
    return {
        initPack: initPack,
        updatePack: updatePack,
        removedPack: removedPack,
        lastVal: lastVal
    };
}