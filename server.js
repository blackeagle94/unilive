var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
var app = express();
var login = require('./routes/login.routes');
var frontendAuth = require('./routes/frontendAuth.route');





//db connection
require('./config/db.config')();

//cors policy
app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//import Routers
const citiesRouter = require('./routes/cities.routes')
const agentsRouter = require('./routes/agents.routes')
const propertiesRouter = require('./routes/properties.routes')
const booksRouter = require('./routes/book.routes')
const signup = require('./routes/signup.routes')

//middlewares
const userAuth = require('./middlewares/userAuth')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//config keys
const config = require('./config');
const { get } = require('./routes/login.routes');
app.set('api_secret_key', config.api_secret_key)

app.use('/', login)
app.use('/frontend', frontendAuth)
app.use('/signup', signup)
// app.use('/api', userAuth)
app.use('/api', citiesRouter)
app.use('/api', agentsRouter)
app.use('/api', propertiesRouter)
app.use('/api', booksRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
