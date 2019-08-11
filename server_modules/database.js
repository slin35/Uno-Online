// mongo database setup
var mongojs = require("mongojs");
var db = mongojs('localhost:27017/myGame', ['account', 'progress']);

Database = {};

Database.isValidPassword = function(data, cb){
    db.account.findOne({username:data.username,password:data.password}, function(err, res){
        if (res){
            cb(true);
        }
        else{
            cb(false);
        }
    });
}

Database.isUsernameTaken = function(data, cb){
    db.account.findOne({username:data.username}, function(err, res){
        if (res){
            cb(true);
        }
        else{
            cb(false);
        }
    });
}

Database.addUser = function(socket, data, cb) {
    db.account.insert({username:data.username,password:data.password, id:socket.id}, function(err){
     //   Database.savePlayerProgress({username:data.username, cards:cards}, function(){
            cb();
     //   })
    });
}

Database.getPlayerProgress = function(username, cb){
    db.progress.findOne({username:username}, function(err, res){
        cb({cards:res.cards});
    });
}

Database.savePlayerProgress = function(data, cb){
    db.progress.update({username:data.username}, data, {upsert:true}, cb);
}