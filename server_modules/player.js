//------------ player class ---------------------------------------------//
Player = function(id, username, deck) {
    var self = {
        id: id,
        username: username,
        cards: deck.dealCards(7),
    //    cards: progress.cards,
        cardPlayed: -1,
    }

    self.updateCards = function(num){
        self.cards.splice(self.cards.indexOf(num), 1);
    }

    self.getPack = function(){
        return {
            id: self.id,
            username: self.username,
            cards: self.cards
        };
    }

    Player.list[id] = self;

    return self;
}

Player.list = {};



//--------- player socket connection ------------------------------------//
var val, lastVal = -1;
var playerNum = 0;

Player.onConnect = function(data, socket, deck, SOCKET_LIST){
    var player = new Player(socket.id, data.username, deck);
    
    initPack.player.push(player); 
    playerNum ++;
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