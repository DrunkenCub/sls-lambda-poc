const serverless = require('serverless-http');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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


import { SQS } from 'aws-sdk';

const sqs = new SQS();

const asyncUserAdd = async (event, context) => {

  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No body was found',
      }),
    };
  }

  const region = context.invokedFunctionArn.split(':')[3];
  const accountId = context.invokedFunctionArn.split(':')[4];
  const queueName = 'receiverQueue';

  const queueUrl = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

  const {email, name} = event.body;
  const uuid = require('uuid');

  const body = {
    userId: uuid.v1().toString(),
    email: email,
    name: name
  }
  try {
    await sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: body,
      MessageAttributes: {
        AttributeNameHere: {
          StringValue: 'Some Attribute Value Here',
          DataType: 'String',
        },
      },
    }).promise();

    message = 'User create message placed in the Queue!';

  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };

};


module.exports.asyncUserAdd = serverless(asyncUserAdd);

module.exports.someQueueReciver = async (event) => {
  try {
    for (const record of event.Records) {
      const messageAttributes = record.messageAttributes;
      console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
      console.log('Message Body -->  ', record.body);
    }
  } catch (err) {
    console.log(err);
  }
};
