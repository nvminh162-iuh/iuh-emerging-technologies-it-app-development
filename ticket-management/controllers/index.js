
const { getAll, getId, upsert } = require('../services')

const controller = {
    getAll: async (req, res) => {
        try {
            const tickets = await getAll();
            return res.render('index', { tickets })
            // return res.status(200).json(tickets)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const ticket = await getId(id)
            if (!ticket) {
                return res.status(404).render('id', { ticket: null })
            }
            return res.render('id', { ticket })
            // return res.status(200).json(ticket)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUpsertForm: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.render('upsert', { ticket: null });
            }
            const ticket = await getId(id);
            return res.render('upsert', { ticket: ticket || null });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    upsert: async (req, res) => {
        try {
            const ticketId = req.params.id || req.body.ticketId;
            if (!ticketId) {
                return res.status(400).json({ message: "ticketId is required" });
            }

            const item = { ...req.body, ticketId };
            await upsert(item);
            return res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = { controller }