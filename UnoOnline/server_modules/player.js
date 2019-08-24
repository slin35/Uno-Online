require('./deck');

Player = function(id, username, cards) {
    var self = {
        id: id,
        username: username,
        cards: cards
    }

    self.updateCards = function(num){
        self.cards.splice(self.cards.indexOf(num), 1);
    }

    Player.list[id] = self;

 //   console.log("player " + id + " created");

    return self;
}

Player.list = {};