const { ScanCommand, GetCommand, DeleteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3") 
const { randomUUID } = require('crypto');

const { s3Client, dynamoDBClient } = require('../config');
const TableName = "EventTickets";
const Bucket = "nguyenvanminh-22003405-s3-midterm";

const findAll = async () => {
    const items = await dynamoDBClient.send(new ScanCommand({ TableName }));
    return items.Items || [];
}

const findById = async (id) => {
    const item = await dynamoDBClient.send(new GetCommand({ TableName, Key: { id } }));
    return item.Item || null;
}

const save = async (id, body, file) => {
    const { eventName, holderName, category, quantity, pricePerTicket, eventDate, status } = body; // trừ image
    // payload create
    let item = { id: id ?? randomUUID(), eventName, holderName, category, quantity, pricePerTicket, eventDate, status } // trừ image
    // payload update
    if (id) {
        const res = await findById(id);
        if (!res) throw new Error("Item not found");
        item = { ...res, eventName, holderName, category, quantity, pricePerTicket, eventDate, status }; // đã rải url ảnh cũ vào
    }
    // payload s3
    if (file) {
        // upload file
        const Key = `${randomUUID()}-${file.originalname}`
        await s3Client.send(
            new PutObjectCommand({ Bucket, Key, Body: file.buffer, ContentType: file.mimetype })
        )
        // remove file cũ
        if (item.imageUrl) {
            await s3Client.send(
                new DeleteObjectCommand({ Bucket, Key: item.imageUrl.split('/').pop() })
            )
        }
        // update new image
        item.imageUrl = `https://${Bucket}.s3.amazonaws.com/${Key}`;
        item.createdAt = new Date().toISOString();
    }
    // upsert data
    await dynamoDBClient.send(
        new PutCommand({ TableName, Item: item })
    )
}

const deleteById = async (id) => {
    const res = await findById(id);
    if (!res) throw new Error("Item not found");
    // remove image s3
    if (res.imageUrl) {
        await s3Client.send(
            new DeleteObjectCommand({ Bucket, Key: res.imageUrl.split("/").pop() })
        )
    }
    await dynamoDBClient.send(new DeleteCommand({ TableName, Key: { id } }))
}

module.exports = { findAll, findById, save, deleteById }