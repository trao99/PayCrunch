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
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected'));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

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

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
