var Player = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.username = initPack.username;
    self.cards = initPack.cards;
    self.cardPlayed = -1;
    self.room = initPack.room;
    self.deck = initPack.deck;

    Player.list[self.id] = self;

    
    return self;
}

Player.list = {};
Player.grid = {};