# Demo with ExpressJS, Serverless Framework, Lambda, DynamoDB and SQS

Sample project which illustrates how Express, Serverless Framework, Lambda, DynamoDB and SQS working together.


# Prerequisites

* AWS Account (duh!)
* NodeJS
* Configured AWS CLI
* serverless npm package installed
	* ``` npm i serverless -g ```
* serverless configured
	* ``sudo sls config credentials --provider aws --key AWS_ACCESS_KEY --secret AWS_SECRET_KEY ``


# How to deploy the app
if serverless and aws cli is configured just try:

`` sls deploy ``

or

``` serverless deploy ```

This will deploy the app in lambda, create API gateway configurations and create DynamoDB tables, etc.


# TODO

Following are the areas which needs to be implemented.

* authorization through Cognito user pool

