var USE_DB = true;
const mongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;


Database = {};

Database.isValidPassword = function(data, cb){
    if (!USE_DB)
        return cb(true);
    mongoClient.connect(url, (err, db) => {
        if (err){
            console.error(err);
            return;
        }

        var dbo = db.db('heroku_llzmb3p6');
        var account = dbo.collection('account');

        account.findOne({username:data.username,password:data.password}, function(err, res){
            if (res){
                cb(true);
            }
            else {
                cb(false);
            }
        });

    });
}

Database.isUsernameTaken = function(data, cb){
    if (!USE_DB)
        return cb(false);

    mongoClient.connect(url, (err, db) => {
        if (err){
            console.error(err);
            return;
        }

        var dbo = db.db('heroku_llzmb3p6');
        var account = dbo.collection('account');
        account.findOne({username:data.username}, function(err, res){
            if (res){
                cb(true);
            }
            else{
                cb(false);
            }
        });

    });
}

Database.addUser = function(socket, data, cb) {
    if (!USE_DB)
        return cb();
    mongoClient.connect(url, (err, db) => {
        if (err){
            console.error(err);
            return;
        }

        var dbo = db.db('heroku_llzmb3p6');
        const account = dbo.collection('account');
        account.insertOne({username:data.username,password:data.password}, function(err, res){
            cb();
        });

    });
}