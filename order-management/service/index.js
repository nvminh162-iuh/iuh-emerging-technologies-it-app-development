const {
  ScanCommand,
  GetCommand,
  DeleteCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { compute, formatCurrency } = require('../utils')

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

const { s3Client, dynamoDBClient } = require("../config");
const TableName = "OrderItems";
const Bucket = "nguyenvanminh-22003405-s3-midterm";

const service = {
  findAll: async () => {
    const items = await dynamoDBClient.send(new ScanCommand({ TableName }));
    return items.Items || [];
  },

  findById: async (id) => {
    const item = await dynamoDBClient.send(
      new GetCommand({ TableName, Key: { id } }),
    );
    return item.Item || null;
  },

  save: async (id, body, file) => {
    const { orderDate, customerName, productName, category, quantity, unitPrice, taxRate, paymentStatus } = body; // trừ image
    // payload create
    let item = {
      id: id ?? randomUUID(), orderDate, customerName, productName, category, quantity, unitPrice, taxRate, paymentStatus, createdAt: new Date().toISOString()
    }; // trừ image

    // payload update
    if (id) {
      const res = await service.findById(id);
      if (!res) throw new Error("Item not found");
      item = { ...res, orderDate, customerName, productName, category, quantity, unitPrice, taxRate, paymentStatus }; // đã rải url ảnh cũ vào
    }
    // payload s3
    if (file) {
      // upload file
      console.log(file.originalname);
      const Key = `${randomUUID()}-${file.originalname}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      // remove file cũ
      if (item.imageUrl) {
        await s3Client.send(
          new DeleteObjectCommand({ Bucket, Key: item.imageUrl.split("/").pop() }),
        );
      }

      // compute, formatCurrency
      const { shippingFee } = compute(item);

      // update new image
      item.imageUrl = `https://${Bucket}.s3.amazonaws.com/${Key}`;
      item.shippingFee = shippingFee;
    }
    // upsert data
    await dynamoDBClient.send(new PutCommand({ TableName, Item: item }));
  },

  deleteById: async (id) => {
    const res = await service.findById(id);
    if (!res) throw new Error("Item not found");
    // remove image s3
    if (res.imageUrl) {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket, Key: res.imageUrl.split("/").pop() }),
      );
    }
    await dynamoDBClient.send(new DeleteCommand({ TableName, Key: { id } }));
  },
};

module.exports = { service };