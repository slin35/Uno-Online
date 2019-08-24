var Card = function(functionality, color, number){
    var f = parseInt(getFunctionality(functionality), 10);
    var c = parseInt(getColor(color), 10);
    var n = parseInt(getNumber(number), 10);
    var value;

    if (f == 7){
        if (c == -1 || n == -1)
            value = null;
        else 
            value = f * 100 + c * 10 + n;
    }
    else if (f == 1 || f == 2 || f == 3){
        if (c == -1 || n != -1)
            value = null;
        else 
            value = f * 10 + c;
    }
    else {
        if (c != -1 || n != -1)
            value = null;
        else 
            value = f;
    }

    var self = {
        value: value
    }

    return self;
}

function getColor(color){
    if (color == "Red")
        return 0;
    else if (color == "Blue")
        return 1;
    else if (color == "Green")
        return 2;
    else if (color == "Yellow")
        return 3;
    else 
        return -1;
}

function getFunctionality(f){
    if (f == "None")
        return 7;
    else if (f == "Skip")
        return 1;
    else if (f == "Reverse")
        return 2;
    else if (f == "Draw2")
        return 3;
    else if (f == "Draw4")
        return 4;
    else
        return 5;
}

function getNumber(number){
    if (number == "None")
        return -1;
    else 
        return number;
}