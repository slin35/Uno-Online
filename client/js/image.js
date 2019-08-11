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


var drawBg = function(){
    var img = new Image();
    img.src = '../client/img/bg.png';
    ctx.drawImage(img, 0, 0);
}

var drawCardPlayed = function(cardPlayed){
    var img = new Image();
    img.src = '../client/img/' + cardPlayed + '.png';
    ctx.drawImage(img, 350, 200);
}


var drawTotalCardNum = function(deckNum){
  //  ctx.fillStyle = 'white';
    ctx.fillText(deckNum, 0, 30);
  //  ctxUi.fillText(deckNum, 0, 30);
    var img = new Image();
    img.src = '../client/img/cover.png';
    ctx.drawImage(img, 0, 40);
  //  ctxUi.drawImage(img, 0, 40);
}

var drawOtherPlayers = function(grid_width, player_list, selfId){
    var len = 0;
    for (var i in Player.list)
        len++;
    if (len < 1)
        return;

    var x = 800/2 - len/2*95;
    var arr = new Array(len);
    for (var i = 0; i < len; i++){
        arr[i] = x + 200*i;
    }
    var c = 0;
    for (var i in player_list){
        var player = player_list[i];
        if (player.id != selfId){
            drawPlayerCards(arr[c], 10, player.cards.length);
            c++;
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
    var x = width/2 - len/2*95;
    var arr = new Array(len);
    for (var i = 0; i < len; i++){
        arr[i] = x + 100*i;
    }
    return arr;
}

function listOfBoxes(player_list, selfId, grid_width, img_y, img_width, img_height){
    var len = player_list[selfId].cards.length;
    var arr = new Array(len);
    var list = listOfXPos(grid_width, len);
    for (var i = 0; i < len; i++){
        arr[i] = new Box(list[i], img_y, img_width, img_height, player_list[selfId].cards[i]);
    }
    return arr;
}

