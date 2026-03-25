const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient, DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const s3Client = new S3Client(config);
const dynamoDBClient = DynamoDBDocument.from(new DynamoDBClient(config));

module.exports = {
  s3Client,
  dynamoDBClient,
};
