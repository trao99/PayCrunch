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

//added
let myDb = mongoose.connection;
myDb.once("open", () => console.log("connected to the database"));
//added



var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
//console.log("hello");
app.post('/addIncome', function (req, res) {
    //console.log("reacfed");
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        //var temp = dbConn.db('login-info');
        myDb.collection('transactions').insertOne(req.body);
    });
    // res.send('helloo');
    res.redirect("/index.html");

});

app.post('/addExpense', function (req, res) {
    //console.log("reacfed");
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        //var temp = dbConn.db('login-info');
        myDb.collection('transactions').insertOne(req.body);
    });
    // res.send('helloo');
    res.redirect("/index.html");

});


app.get('/getIncome',  function(req, res) {
    var result = [];
    dbConn.then(function(db) {
        db.collection('loginIDs').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
