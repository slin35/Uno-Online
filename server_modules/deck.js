// define a deck of cards
Deck = function() {
    var self = {
        cards: []
    }

    self.initCards = function() {
        for (var i = 0; i < 4; i++) {
            self.cards.push(4);         //push draw4 cards
            self.cards.push(5);         //push wild cards
            self.cards.push(6);         //push blank cards
        }
        for (var i = 0; i < 4; i++) {
            self.cards.push(10+i);      //push skip cards
            self.cards.push(10+i);
            self.cards.push(20+i);     //push reverse cards
            self.cards.push(20+i);
            self.cards.push(30+i);     //push draw2 cards
            self.cards.push(30+i);
        }
        
        self.cards.push(700);           //push 4 color '1's
        self.cards.push(710);
        self.cards.push(720);
        self.cards.push(730);
        
        for (var i = 1; i < 10; i++) {
            for (var j = 0; j < 2; j++) {
                self.cards.push(700+i);       //push 2 of the same cards 
                self.cards.push(710+i);       //from 1-9 and 4 colors
                self.cards.push(720+i);
                self.cards.push(730+i);
            }  
        }
    }

    self.shuffleCards = function() {
        var arrayLen = self.cards.length, idx, c;
        while (arrayLen) {
            idx = Math.floor(Math.random() * arrayLen--);
            c = self.cards[arrayLen];
            self.cards[arrayLen] = self.cards[idx];
            self.cards[idx] = c;
        }
    }

    self.dealCards = function(num) {
        return self.cards.splice(0, Math.min(num, self.cards.length));
    }

    return self;
}