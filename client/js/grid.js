function make2Darray(rows, cols){
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++){
        arr[i] = new Array(cols);
        for (var j = 0; j < cols; j++){
            arr[i][j] = -1;
        }
    }
    return arr;
}

var Grid = function(width, height, grid_size){
    var self = {
        rows: width/grid_size,
        cols: height/grid_size,
        size: grid_size,
        array: make2Darray(width/grid_size, height/grid_size)
    }

    self.addVal = function(x, y, val){
        self.array[x][y] = val;
    }

    self.removeVal = function(x, y){
        self.array[Math.floor(x/self.size)][Math.floor(y/self.size)] = undefined;
    }

    self.getCardVal = function(x, y){
        return self.array[Math.floor(x/self.size)][Math.floor(y/self.size)];
    }

    self.cleanUp = function(){
        self.array = make2Darray(self.rows, self.cols);
    }

    self.setValForBox = function(box){
        var minX = Math.floor(box.upLX/self.size);
        var minY = Math.floor(box.upLY/self.size);
        var maxX = Math.floor(box.botRX/self.size);
        var maxY = Math.floor(box.botRY/self.size);
        for (var i = minX; i <= maxX; i++){
            for (var j = minY; j <= maxY; j++){
                self.addVal(i, j, box.value);
            }
        }
    }

    self.printGrid = function(){
        for (var i = 0; i < self.rows; i++){
          var line = "  ";
            for (var j = 0; j < self.cols; j++) {
                line = line + self.array[i][j] + "  ";
            }
            console.log(line);
        }
    }


    return self;
}