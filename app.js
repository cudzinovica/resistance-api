const MONGODB_HOST = "ds333248.mlab.com";
const MONGODB_PORT = "33248";
const MONGODB_DBNAME = "heroku_3gqsvj8b";
const MONGODB_USER = "user";
const MONGODB_PASSWORD = "password0";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index.route');
var users = require('./routes/users.route');
var api = require('./routes/api.route');

var bluebird = require('bluebird')

var app = express();

// sockets.io
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: '*:*' });
server.listen(4000);
require('./sockets/sockets')(io);

// mongoose
var mongoose = require('mongoose')
mongoose.Promise = bluebird
mongodb_url = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DBNAME}`
mongoose.connect(mongodb_url, { useNewUrlParser: true })
    .then(()=> { console.log(`Succesfully Connected to the Mongodb Database  at URL : ${mongodb_url}`)})
    .catch(()=> { console.log(`Error Connecting to the Mongodb Database at URL : ${mongodb_url}`)})

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
