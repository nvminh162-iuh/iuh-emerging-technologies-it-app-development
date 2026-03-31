const { service } = require("../service");
const { compute, formatCurrency } = require("../utils");
const { validation } = require("../validation");

const controller = {
  renderAll: async (req, res) => {
    const { keyword, status, specialty } = req.query;
    let items = await service.findAll();

    if (keyword) {
      const keywordLow = keyword.toLowerCase();
      items = items.filter(item => item.patientName?.toLowerCase().includes(keywordLow)) || items.filter(item => item.doctorName?.toLowerCase().includes(keywordLow));
    }

    if (status && status !== "ALL") {
      const statusLow = status.toLowerCase();
      items = items.filter(item => item.status?.toLowerCase().includes(statusLow));
    }

    if (specialty) {
      const specialtyLow = specialty.toLowerCase();
      items = items.filter(item => item.specialty?.toLowerCase().includes(specialtyLow));
    }

    return res.render("index", { items, compute, formatCurrency });
  },

  renderForm: async (req, res) => {
    const { id } = req.params;
    const item = id ? await service.findById(id) : null;
    return res.render("form", { item, error: null });
  },

  save: async (req, res) => {
    const invalid = validation(req.body);
    if (invalid) {
      const item = { ...req.body, ...(req.params.id ? { id: req.params.id } : {}) };
      return res.render("form", { item, error: invalid }); 
    }

    try {
      await service.save(req.params.id, req.body, req.file);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },

  deleteById: async (req, res) => {
    try {
      await service.deleteById(req.params.id);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
};

module.exports = { controller };