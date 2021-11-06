const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require('connect-flash')
const session = require('express-session');
const passport = require("passport");

const app = express()

// Passport Config
require('./config/passport')(passport)

//DB config
const db = require('./config/keys').MongoURI;

//Connect to mongo
mongoose.connect(db,{ useNewUrlParser:true, useUnifiedTopology:true }).then(() => {
    console.log('Mongo db conected...')
}).catch(err => {
    console.log(err)
})

//EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs');


//BodyParser
app.use(express.urlencoded({ extended:false }));

// Express Sessio Middleware
app.use(session({
  secret: 'Secret',
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

// Globlals vars
app.use( (req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on POrt ${PORT}`));
