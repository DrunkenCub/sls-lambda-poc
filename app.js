const serverless = require('serverless-http');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const uuid = require('uuid');
const AWS = require('aws-sdk');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

// module.exports = app;
module.exports.handler = serverless(app);

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.someQueueReciver = (event) => {
  try {
    for (const record of event.Records) {
      const userId = uuid.v1().toString();
      console.log('Message Body:  ', record.body);
      const user = JSON.parse(record.body);
      const params = {
        TableName: USERS_TABLE,
        Item: {
          userId: userId,
          email: user.email,
          name: user.name,
        },
      };

      console.log(params);

      dynamoDb.put(params, (error) => {
        if (error) {
          console.log(error);
          console.log('Could not create user');
        }
        console.log('user created');
      });
    }
  } catch (err) {
    console.log(err);
  }
};
