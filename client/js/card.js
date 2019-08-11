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
        function: digits[0]
    }

    self.printCard = function(){
        console.log("function: "+self.function + " color: " + self.color + " number: "+self.number);
    }

    return self;
}

function getColor(arr){
    if (arr.length > 2)
        return arr[1];
    return -1;
}

function getNumber(arr){
    if (arr.length > 2)
        return arr[2];
    return -1;
}