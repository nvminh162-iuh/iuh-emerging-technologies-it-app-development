const { findAll, findById, save, deleteById } = require("../service");
const { validate } = require("../validation");
const { compute, formatCurrency } = require("../utils");

const controller = {
  renderAll: async (req, res) => {
    const { keyword, status } = req.query;
    let items = await findAll();

    if (keyword) {
      const searchName = keyword.toLowerCase();
      items = items.filter((item) => item.eventName?.toLowerCase().includes(searchName) || item.holderName?.toLowerCase().includes(searchName));
    }

    if (status && status !== 'ALL') {
      const searchStatus = status.toLowerCase();
      items = items.filter((item) => item.status?.toLowerCase().includes(searchStatus))
    }

    return res.render("index", { items, compute, formatCurrency });
  },
  renderForm: async (req, res) => {
    const { id } = req.params;
    const item = id ? await findById(id) : null;
    return res.render("form", { item, error: null });
  },
  save: async (req, res) => {
    const invalid = validate(req.body);
    if (invalid) {
      const item = {
        ...req.body,
        ...(req.params.id ? { id: req.params.id } : {}),
      };
      return res.render("form", { item, error: invalid });
    }

    try {
      await save(req.params.id, req.body, req.file);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
  deleteById: async (req, res) => {
    try {
      await deleteById(req.params.id);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
};

module.exports = { controller };
