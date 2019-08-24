require('./deck')
require('./player')
require('./game')


Room = function(initPack){
    var self = {
        roomID: initPack.roomID,
        playerNum: 1,
        capacity: initPack.capacity,
        deck: initPack.deck,
        players: {},
        player_order: [],
        player_turn: 0,
        cardPlayed: -1,
        winner: null
    }

    self.getNextTurn = function(){
        if (self.player_turn == self.capacity - 1){
            self.player_turn = 0;
        }
        else {
            self.player_turn ++;
        }
        return self.player_turn;
    }

    Room.list[initPack.roomID] = self;

    return self;
}

Room.list = {}
Room.curRoom = undefined;

Room.onConnect = function(data, socket, SOCKET_LIST){
    
    socket.on('enterRoom', function(roomID){
        if (Room.list[roomID]){
            var room = Room.list[roomID];
            room.playerNum ++;

            var player = new Player(socket.id, data.username, room.deck.dealCards(7));
            room.players[socket.id] = player;
            room.player_order.push(socket.id);

 
            socket.emit('curRoom', roomID);
            socket.emit('curPlayer', socket.id);
            socket.emit('enterRoomResponse', {success:true, roomID: roomID});
            
        }
        else {
            socket.emit('enterRoomResponse', {success:false});
        }
    });

    socket.on('createRoom', function(capacity){
        var roomID = parseInt(("" + socket.id).slice(2,7), 10);
        var deck = Deck();
        deck.initCards();
        deck.shuffleCards();
        var room = new Room({
            roomID: roomID,
            capacity: capacity,
            deck: deck
        });
        var player = new Player(socket.id, data.username, room.deck.dealCards(7));
        room.players[socket.id] = player;
        room.player_order.push(socket.id);

        Room.list[roomID] = room;

        socket.emit('curRoom', roomID);
        socket.emit('curPlayer', socket.id);
    });

    socket.on('play', function(data){
        var room = Room.list[data.roomID];
        var turn = room.player_turn;

        if (data.playerID == room.player_order[turn]){
            Game.applyGameRules(room, data, socket);

            // update game status
            var player = room.players[data.playerID];

           if (player.cards.length == 0){
                room.winner = player.username;
            }

            socket.emit('playResponse', {success: true});
        }
        else {
            socket.emit('playResponse', {success: false});
        }
    });

    socket.on('drawACard', function(data){
        var room = Room.list[data.roomID];
        var player = room.players[data.playerID];
        var card = room.deck.dealCards(1)[0];

        player.cards.push(card);

    });

    socket.on('selectColorResponse', function(data){
        var room = Room.list[data.roomID];
      //  console.log(data.color + "  " + data.roomID);
        if (data.color == "Red")
            room.cardPlayed = 800;
        else if (data.color == "Blue")
            room.cardPlayed = 810;
        else if (data.color == "Green")
            room.cardPlayed = 820;
        else
            room.cardPlayed = 830;

        room.getNextTurn();
    });

    socket.on('selectCardResponse', function(data){
        var room = Room.list[data.roomID];
        var player = room.players[data.playerID].cards.push(data.value);
        Game.applyGameRules(room, {cardVal:data.value, playerID:data.playerID}, socket);
    });

    socket.on('sendMsgToServer', function(data){
        var playerName = data.username;
        var chatInput = data.input;
        var roomID = data.roomID;
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', '(Room ' + roomID + ')' + playerName + ': ' + chatInput);
        }
    });

    socket.on('sendPmToServer', function(data){
        var recipientSocket = null;
        for (var i in Room.list){
            var players = Room.list[i].players;
            for (var j in players){
                if (players[j].username == data.username){
                    recipientSocket = SOCKET_LIST[j];
                    break;
                }
            }
            if (recipientSocket == null){
                socket.emit('addToChat', 'player '+data.username+' is not online.');
            }
            else {
                recipientSocket.emit('addToChat', 'From ' + data.sender + ': ' + data.message);
                socket.emit('addToChat', 'To ' + data.username + ': ' + data.message);
            }
        }
    });

}

Room.onDisconnect = function(socket){
    var room;
    for (var i in Room.list){
        room = Room.list[i];
        if (room.players[socket.id]){
            delete room.players[socket.id];
            console.log("disconnected " + socket.id);
            room.playerNum --;


            break;
        }
    }
    
    if (!room)
        return;
    if (room.playerNum == 0){
        console.log('delete room ' + room.roomID);
        delete room;
    }
}
