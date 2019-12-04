var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var documents = require('./routes/document');

var elastic = require('./elasticsearch')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/documents', documents);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

elastic.isIndexExist().then(function (exists) {
  if (exists) {
    return elastic.deleteIndex()
  }
}).then(function () {
  elastic.initIndex()
    .then(function (initResponse) {
      if (initResponse.acknowledged) {
        return elastic.initMapping()
      }
    })
    .catch(function (initIndexError) {
      console.log('--Init Index Error-- ', initIndexError)
    })
    .then(function () {
      var promises = [
        'Thing Explainer',
        'The Internet Is a Playground',
        'The Pragmatic Programmer',
        'The Hitchhikers Guide to the Galaxy',
        'Trial of the Clone',
        'All Quiet on the Western Front',
        'The Animal Farm',
        'The Circle'
      ].map(function (bookTitle) {
        return elastic.addDocumentToIndex({
          title: bookTitle,
          content: bookTitle + " content"
        })
      })
      return Promise.all(promises)
    }).catch(function (error) {
      console.log('------Elastic Search Error ----- : ', error)
    })
})

module.exports = app;
