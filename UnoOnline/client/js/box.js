var Box = function(uperX, uperY, width, height, val){
    var self = {
        upLX: uperX,
        upLY: uperY,
        upRX: uperX + width,
        upRY: uperY,
        botLX: uperX,
        botLY: uperY + height,
        botRX: uperX + width,
        botRY: uperY + height,
        value: val
    }

    return self;
}