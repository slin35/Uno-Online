function drawRoomNumber(num){
    ctx.font = '20px Arial';
    ctx.fillText("Room: " + num, 0, 200);
    ctx.font = '30px Arial';
}

function drawBg(){
    var img = new Image();
    img.src = '../client/img/bg.png';
    ctx.drawImage(img, 0, 0);
}

function drawImage(x, y, val){
    var img = new Image();
    img.src = "../client/img/"+val+".png";
    ctx.drawImage(img, x, y);
}

function drawImages(list){
    var len = list.length;
    var arr = listOfXPos(800, len);
    for (i = 0; i < len; i++){
        drawImage(arr[i], 400, list[i]);
    }
}

function drawTotalCardNum(deckNum){
    ctx.font = '20px Arial';
    ctx.fillText(deckNum + " cards left", 0, 30);
    var img = new Image();
    img.src = '../client/img/cover.png';
    ctx.drawImage(img, 0, 40);
    ctx.font = '30px Arial';
}

function displayStatus(room_list, selfRoomID, selfPlayerID){
    var turn = room_list[selfRoomID].player_order[room_list[selfRoomID].player_turn];
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    if (turn == selfPlayerID){
        ctx.fillText("its your turn", 300, 20);
    }
    else {
        ctx.fillText("please wait", 300, 20);
    }
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
}

function displayWinner(room_list, selfRoomID, selfPlayerID, winner){
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    if (room_list[selfRoomID].players[selfPlayerID].username == winner){
        ctx.fillText("You Win!", 300, 250);
    }
    else {
        ctx.fillText("You lose!", 300, 250);
    }
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
}

function drawCardPlayed(cardPlayed){
    if (cardPlayed == -1)
        return;
    var img = new Image();
    img.src = '../client/img/' + cardPlayed + '.png';
    ctx.drawImage(img, 350, 200);
}

var drawOtherPlayers = function(grid_width, room_list, selfRoomID, selfPlayerID){
    var len = room_list[selfRoomID].playerNum;

    var x = (grid_width - 95)/(len+1) + 20;
    var arr = new Array(len);
    for (var i = 0; i < len; i++){
        arr[i] = x * (i + 1);
    }
    var idx = 0, players = room_list[selfRoomID].players;
    for (var i in players){
        var player = players[i];
        if (player.id != selfPlayerID){
            drawPlayerCards(arr[idx], 30, player.cards.length);
            idx++;
        }
    } 
}


var drawPlayerCards = function(x, y, cardNum){
    for (var i = 0; i < cardNum; i++){
        var img = new Image();
        img.src = '../client/img/cover.png';
        ctx.drawImage(img, x + i*10, y);
    }
}

function listOfXPos(width, len){
    var x = (width - 95) /(len+1);
    var arr = new Array(len);
    for (var i = 0; i < len; i++){
        arr[i] = x * (i + 1);
    }
    return arr;
}

function listOfBoxes(player_list, selfId, grid_width, img_y, img_width, img_height){
    var len = player_list[selfId].cards.length;
    var arr = new Array(len);
    var width = (800 - 95) / (len+1);
    var list = listOfXPos(grid_width, len);
    for (var i = 0; i < len; i++){
        arr[i] = new Box(list[i], img_y, width, img_height, player_list[selfId].cards[i]);
    }
    return arr;
}