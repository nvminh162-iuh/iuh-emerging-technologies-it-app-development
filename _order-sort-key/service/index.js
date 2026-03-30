const {
  ScanCommand,
  GetCommand,
  DeleteCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

const { s3Client, dynamoDBClient } = require("../config");
const { computeDiscountLabel } = require("../utils");

const TableName = "OrderItems";
const Bucket = "nguyenvanminh-22003405-s3-midterm";

const service = {
  findAll: async () => {
    const result = await dynamoDBClient.send(new ScanCommand({ TableName }));
    return result.Items || [];
  },

  findById: async (orderId, orderDate) => {
    const result = await dynamoDBClient.send(
      new GetCommand({ TableName, Key: { orderId, orderDate } })
    );
    return result.Item || null;
  },

  save: async (orderId, orderDate, body, file) => {
    const {
      customerName, productName, category,
      quantity, unitPrice, taxRate, paymentStatus,
    } = body;

    const discountLabel = computeDiscountLabel(category, quantity);

    // payload create
    let item = {
      orderId: orderId ?? randomUUID(),
      orderDate: orderDate ?? body.orderDate,
      customerName,
      productName,
      category,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      taxRate: Number(taxRate),
      paymentStatus,
      discountLabel,
      createdAt: new Date().toISOString(),
    };

    // payload update – giữ lại imageUrl cũ và createdAt gốc
    if (orderId && orderDate) {
      const existing = await service.findById(orderId, orderDate);
      if (!existing) throw new Error("Item not found");
      item = {
        ...existing,
        customerName,
        productName,
        category,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        taxRate: Number(taxRate),
        paymentStatus,
        discountLabel,
      };
    }

    // Upload ảnh lên S3 nếu có file mới
    if (file) {
      console.log("Uploading:", file.originalname);
      const Key = `${randomUUID()}-${file.originalname}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      // Xóa ảnh cũ trên S3
      if (item.imageUrl) {
        await s3Client.send(
          new DeleteObjectCommand({ Bucket, Key: item.imageUrl.split("/").pop() })
        );
      }
      item.imageUrl = `https://${Bucket}.s3.amazonaws.com/${Key}`;
    }

    await dynamoDBClient.send(new PutCommand({ TableName, Item: item }));
  },

  deleteById: async (orderId, orderDate) => {
    const existing = await service.findById(orderId, orderDate);
    if (!existing) throw new Error("Item not found");
    if (existing.imageUrl) {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket, Key: existing.imageUrl.split("/").pop() })
      );
    }
    await dynamoDBClient.send(
      new DeleteCommand({ TableName, Key: { orderId, orderDate } })
    );
  },
};

module.exports = { service };
