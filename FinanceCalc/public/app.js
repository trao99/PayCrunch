const mongoose = require("mongoose")    //added
//var cors = require("cors"); //added

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
//var mongodb = require('mongodb');

//var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');
//var dbConn = mongoose.connect('mongodb+srv://yfarook:<password>@cluster0-prk8z.mongodb.net/test', {useNewUrlParser: true});

//app.use(cors());



var dbConn = mongoose.connect('mongodb+srv://sagar:fakepassword@paycrunch-xngfl.mongodb.net/login-info?retryWrites=true', {useNewUrlParser: true});
let myDb = mongoose.connection;
myDb.once("open", () => console.log("connected to the database"));
//added




var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/insert', function (req, res) {
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        //const myDb = db.db('login-info');
        myDb.collection('loginIDs').insertOne(req.body);
    });
    res.send('Data received:\n' + JSON.stringify(req.body));
});

app.get('/view-login',  function(req, res) {
    dbConn.then(function(db) {
        //const myDb = db.db('login-info');
        myDb.collection('loginIDs').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
