Game = {};

Game.isValidCard = function(c1, c2){
    if (c1 == -1 || c2 == 4 || c2 == 5 || c2 == 6 || c1 == 6)
        return true;
    var prev = new Card(c1);
    var cur = new Card(c2);

    
    if ((prev.color == cur.color && prev.color != -1) 
            || (prev.number == cur.number && prev.number != -1)
            || (prev.function == cur.function && prev.function != 7))
        return true;
    
    return false;
}

Game.isSkip = function(val){
    var card = new Card(val);
    if (card.function == 1)
        return true;
    return false;
}

Game.isReverse = function(val){
    var card = new Card(val);
    if (card.function == 2)
        return true;
    return false;
}

Game.isDraw2 = function(val){
    var card = new Card(val);
    if (card.function == 3)
        return true;
    return false;
}

Game.isDraw4 = function(val){
    var card = new Card(val);
    if (card.function == 4)
        return true;
    return false;
}

Game.isWild = function(val){
    var card = new Card(val);
    if (card.function == 5)
        return true;
    return false;
}

Game.isBlank = function(val){
    var card = new Card(val);
    if (card.function == 6)
        return true;
    return false;
}

Game.isNormal = function(val){
    var card = new Card(val);
    if (card.function == 7)
        return true;
    return false;
}

Game.applyGameRules = function(room, data, socket){

    if (Game.isValidCard(room.cardPlayed, data.cardVal)) {

        var player = room.players[data.playerID];
        player.updateCards(data.cardVal);
        room.cardPlayed = data.cardVal;
        console.log("played " + data.cardVal);

        if (Game.isNormal(data.cardVal)){
            room.getNextTurn();
        }
        else if (Game.isSkip(data.cardVal)){
            room.getNextTurn();
            room.getNextTurn();
        }
        else if (Game.isWild(data.cardVal)){
            socket.emit('selectColor');
        }
        else if (Game.isDraw2(data.cardVal)){
            var turn = room.getNextTurn();
            var player = room.players[room.player_order[turn]];
            var cards = room.deck.dealCards(2);
            player.cards = player.cards.concat(cards);
        }
        else if (Game.isDraw4(data.cardVal)){
            var turn = room.getNextTurn();
            var player = room.players[room.player_order[turn]];
            var cards = room.deck.dealCards(4);
            player.cards = player.cards.concat(cards);
            socket.emit('selectColor');
            if (room.player_turn == 0)
                room.player_turn = room.capacity - 1;
            else 
                room.player_turn--;
        }
        else if (Game.isReverse(data.cardVal)){
            room.player_order = room.player_order.reverse();
            room.player_turn = room.capacity - 1 - room.player_turn;
            room.getNextTurn();
        }
        else if (Game.isBlank(data.cardVal)){
            socket.emit('selectCard');
        }  

    } 
}


// define card based on its functionality, color, and number
var Card = function(cardVal) {
    // color => red: 0, blue: 1, green: 2, yellow: 3
    // number => 0: 0, 1: 1 ... 9: 9
    // functionality => none: 7, skip: 1, reverse: 2, draw2: 3, draw4: 4, wild: 5, blank 6
    var digits = [];
    while (cardVal > 0){
        digits.push(cardVal % 10);
        cardVal = parseInt(cardVal / 10);
    }

    digits.reverse();
    
    var self = {
        color: getColor(digits),
        number: getNumber(digits),
        function: digits[0],
    }

    self.printCard = function(){
        console.log("function: "+self.function + " color: " + self.color + " number: "+self.number);
    }

    return self;
}

function getColor(arr){
    if (arr.length >= 2)
        return arr[1];
    return -1;
}

function getNumber(arr){
    if (arr.length > 2)
        return arr[2];
    return -1;
}