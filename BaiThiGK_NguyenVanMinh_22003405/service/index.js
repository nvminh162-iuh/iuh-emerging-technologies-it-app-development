const { ScanCommand, GetCommand, DeleteCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

const { s3Client, dynamoDBClient } = require("../config");
const TableName = "ClinicAppointments";
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
    const { patientName, doctorName, specialty, appointmentDate, fee, status, noteImageUrl } = body;
    // payload create
    let item = { id: id ?? randomUUID(), patientName, doctorName, specialty, appointmentDate, fee, status, noteImageUrl };

    // payload update
    if (id) {
      const res = await service.findById(id);
      if (!res) throw new Error("Item not found");
      item = { ...res, patientName, doctorName, specialty, appointmentDate, fee, status, noteImageUrl };
    }

    // payload s3
    if (file) {
      const Key = `${randomUUID()}-${file.originalname}`;
      await s3Client.send(new PutObjectCommand({ Bucket, Key, Body: file.buffer, ContentType: file.mimetype }));

      if (item.image) {
        await s3Client.send(new DeleteObjectCommand({ Bucket, Key: item.image.split("/").pop() }));
      }

      item.image = `https://${Bucket}.s3.amazonaws.com/${Key}`;
    }

    await dynamoDBClient.send(new PutCommand({ TableName, Item: item }));
  },

  deleteById: async (id) => {
    const res = await service.findById(id);
    if (!res) throw new Error("Item not found");

    if (res.image) {
      await s3Client.send(new DeleteObjectCommand({ Bucket, Key: res.image.split("/").pop() }));
    }

    await dynamoDBClient.send(new DeleteCommand({ TableName, Key: { id } }));
  },
};

module.exports = { service };