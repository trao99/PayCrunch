const mongoose = require("mongoose")    //added
//var cors = require("cors"); //added
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash')
const session = require('express-session');
const express = require('express');
const path = require('path');
const passport = require('passport');


//passport config
require('./config/passport')(passport);

var app = express();

// DB config
var passDb = require('./config/keys').mongoURI;

// Connect to Mongo
var dbConn = mongoose.connect(passDb, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected'));

let myDb = mongoose.connection;

global.username;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
//static
app.engine('html', require('ejs').renderFile);

// bodyParser
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Gloabal variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


//var dbConn = mongoose.connect('mongodb+srv://sagar:fakepassword@paycrunch-xngfl.mongodb.net/all-transaction-info?retryWrites=true', {useNewUrlParser: true});

//added
//let myDb = mongoose.connection;
//myDb = mongoose.connection;
app.use(express.static(path.resolve(__dirname, 'public')));


app.post('/addIncome', function (req, res) {
    //console.log("reacfed");
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        //var temp = dbConn.db('login-info');
        myDb.collection('transactions').insertOne({"user": username, "typeIncome": req.body.typeIncome, "income": req.body.income, "date": new Date(Date.now())});
    });
    // res.send('helloo');
    res.redirect("/index.html");

});

app.post('/addExpense', function (req, res) {
    //console.log("reacfed");
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        //var temp = dbConn.db('login-info');
        myDb.collection('transactions').insertOne({"user": username, "nameExpense": req.body.nameExpense, "expense": req.body.expense, "date": new Date(Date.now())});
    });
    // res.send('helloo');
    res.redirect("/index.html");

});


app.get('/getIncome',  function(req, res) {
    console.log(username);
    var listItems = [];
    myDb.collection('transactions').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    var netWorth = 0;
    var listOfSums = [];

    for(var i=0; i<result.length; i++){
      if(result[i].user == username){
        listItems.push(result[i]);
      }
    }
    console.log(listItems);
    for(var j = 0; j < listItems.length; j++){
      var income = parseInt(listItems[j].income);
      var expense = 0;
      if(isNaN(income)){
        income = 0;
        expense = parseInt(listItems[j].expense);
        //console.log(expense)
        netWorth = netWorth - parseInt(expense);
      }
      else{
      netWorth = netWorth+parseInt(income);
    }
      listOfSums.push(netWorth);

    }


      //console.log(listOfSums);

      //console.log(parseInt(income));
      //console.log(netWorth);

    res.render('incomeReport.ejs', {quotes:  listItems, net: listOfSums});
  })
});
app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
