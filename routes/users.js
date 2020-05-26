var express = require('express');
var router = express.Router();

const uuid = require('uuid');
const AWS = require('aws-sdk');
const email_validator = require('email-validator');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();


router.get('/:userId', function(req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {userId, email, name} = result.Item;
      res.json({ userId, email, name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});



router.post('/', function(req, res){
  const {email, name} = req.body;

  const userId = uuid.v1().toString();
  if (!email_validator.validate(email)){
    res.status(400).json({ error: '"email" is incorrect' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      email: email,
      name: name,
    },
  };

  console.log(params);

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, email, name });
  });
});

module.exports = router;
