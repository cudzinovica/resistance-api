var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index.route');
var users = require('./routes/users.route');
var api = require('./routes/api.route');

var bluebird = require('bluebird');

var schedule = require('node-schedule');
var scheduled = require('./scheduled/scheduled');

var app = express();

// mongoose
var mongoose = require('mongoose')
mongoose.Promise = bluebird
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(()=> { console.log(`Succesfully Connected to the Mongodb Database  at URL : ${process.env.MONGODB_URI}`)})
    .catch(()=> { console.log(`Error Connecting to the Mongodb Database at URL : ${process.env.MONGODB_URI}`)})

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Scheduled functions
schedule.scheduleJob('0 0 * * *', () => scheduled.deleteOldGames);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
