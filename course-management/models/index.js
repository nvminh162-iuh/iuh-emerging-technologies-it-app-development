const { dynamodb } = require('../utils/aws-helper');
const { PutCommand, ScanCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const tableName = 'subjects';

const subjectsModel = {
    create: async (subject) => {
        const id = uuidv4();
        const params = {
            TableName: tableName,
            Item: {
                id,
                name: subject.name,
                type: subject.type,
                semester: subject.semester,
                faculty: subject.faculty,
                image: subject.image,
            },
        };
        try {
            await dynamodb.send(new PutCommand(params));
            return { id: id, ...subject };
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },
    getAll: async () => {
        const params = { TableName: tableName };
        try {
            const subjects = await dynamodb.send(new ScanCommand(params));
            return subjects.Items;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },
    getById: async (id) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: 'id = :id', // Điều kiện để lấy subject dựa trên subjectId
            ExpressionAttributeValues: { ':id': id }, // Giá trị của điều kiện trên
        };
        try {
            const subject = await dynamodb.send(new QueryCommand(params));
            return subject.Items[0];
        } catch (error) {
            console.error('Error getting one subject:', error);
            throw error;
        }
    },
    update: async (id, subject) => {
        const params = {
            TableName: tableName,
            Key: {
                // Key của subject cần cập nhật
                id: id, // id là partition key
                name: subject.name, // bởi vì chúng ta có thêm sort key nên cần thêm name vào key
            },
            UpdateExpression: 'set #t = :type, #s = :semester, #f = :faculty, #i = :image',
            ExpressionAttributeNames: {
                '#t': 'type',
                '#s': 'semester',
                '#f': 'faculty',
                '#i': 'image',
            },
            ExpressionAttributeValues: {
                ':type': subject.type,
                ':semester': subject.semester,
                ':faculty': subject.faculty,
                ':image': subject.image,
            },
            ReturnValues: 'ALL_NEW', // Trả về thông tin của subject sau khi cập nhật,  có các option khác như NONE, UPDATED_OLD, ALL_OLD
        };
        try {
            const subject = await dynamodb.send(new UpdateCommand(params));
            return subject.Attributes;
        } catch (error) {
            console.error('Error updating subject:', error);
            throw error;
        }
    },
    delete: async (id, name) => {
        const params = {
            TableName: tableName,
            Key: {
                id: id, // id là partition key
                name: name, // bởi vì chúng ta có thêm sort key nên cần thêm name vào key
            },
        };
        try {
            await dynamodb.send(new DeleteCommand(params));
            return { id: id };
        } catch (error) {
            console.error('Error deleting subject:', error);
            throw error;
        }
    },
};

module.exports = subjectsModel;
