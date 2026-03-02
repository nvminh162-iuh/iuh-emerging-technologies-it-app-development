const subjectsModel = require('../models');
const { uploadFile } = require('../service/file.service');

const subjectsController = {
    // Get all subjects
    getSubjects: async (req, res) => {
        try {
            const subjects = await subjectsModel.getAll();
            return res.status(200).json(subjects);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error getting subjects');
        }
    },
    // Get single subject by ID
    getSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const subject = await subjectsModel.getById(id);
            if (subject) {
                return res.status(200).json(subject);
            }
            return res.status(404).send('Subject not found');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error getting subject');
        }
    },
    createSubject: async (req, res) => {
        const { name, type, semester, faculty } = req.body;
        const image = req.file;
        try {
            const imageUrl = await uploadFile(image);
            const subject = await subjectsModel.create({
                name,
                type,
                semester,
                faculty,
                image: imageUrl,
            });
            return res.status(200).json(subject);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error creating subject');
        }
    },

    updateSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, type, semester, faculty } = req.body;
            const image = req.file;

            // Nếu có file mới thì upload, không thì giữ image cũ từ req.body
            const imageUrl = image ? await uploadFile(image) : req.body.image;

            const updatedSubject = await subjectsModel.update(id, {
                name,
                type,
                semester,
                faculty,
                image: imageUrl,
            });

            return res.status(200).json(updatedSubject);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error updating subject');
        }
    },

    deleteSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const existed = await subjectsModel.getById(id);
            if (!existed) {
                return res.status(404).send('Subject not found');
            }
            await subjectsModel.delete(id, existed.name);
            return res.status(200).json({ message: 'Subject deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).send('Error deleting subject');
        }
    },
};

module.exports = subjectsController;
