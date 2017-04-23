
require('dotenv').config();
var request = require('request');
var mongodb = require('./Model/mongodb.utils');
var scheduler = require('./scheduler.util.js');
var News = require('./Model/news.model.js');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var api = require('./api.util.js');
var fs = require('fs')
var winston = require('winston');
var morgan = require('morgan')
var path = require('path')
var favicon = require('serve-favicon');



mongodb.createEventListeners();
mongodb.connect();



scheduler.apiFetchScheduler();

News.remove({}, function (err, cb) {
  console.log("Database empty");
});


//creating access.log or server log file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// Init App
var app = express();


var logger = new winston.Logger ({
  transports: [
    new winston.transports.Console ({colorize: true}),
    new winston.transports.File ({
      filename:'./winstonLog.log'
    })
  ]
});

try {
    api.fetchApi();
    logger.info("News Api fetch complete");
} catch(err) {
    logger.error('Could not fetch news' + err);
  }


app.use(morgan('combined', {stream: accessLogStream}))
app.use(favicon(__dirname + '/public/favicon.ico'));

var routes = require('./routes/index');
var users = require('./routes/users');




// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(err){
  if(err) {
    logger.error(err);
  }
	logger.info('Server started on port '+ app.get('port'));
});