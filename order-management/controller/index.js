const { service } = require("../service");
const { compute, formatCurrency } = require('../utils')
const { validation } = require("../validation")

const controller = {
  renderAll: async (req, res) => {
    const { keyword, orderDateFrom, orderDateTo, paymentStatus } = req.query;
    let items = await service.findAll();

    if (keyword) {
      const keywordLow = keyword.toLowerCase();
      items = items.filter(item => item?.customerName.toLowerCase().includes(keywordLow)) || items.filter(item => item?.productName.toLowerCase().includes(keywordLow))
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      const paymentStatusLow = paymentStatus.toLowerCase();
      items = items.filter(item => item?.paymentStatus.toLowerCase().includes(paymentStatusLow))
    }

    if (orderDateFrom) {
      items = items.filter(item => item.orderDate >= orderDateFrom);
    }

    if (orderDateTo) {
      items = items.filter(item => item.orderDate <= orderDateTo);
    }

    return res.render("index", {
      items, compute, formatCurrency
    });
  },

  renderForm: async (req, res) => {
    const { id } = req.params;
    const item = id ? await service.findById(id) : null;
    return res.render("form", { item, error: null });
  },
  
  save: async (req, res) => {
    const invalid = validation(req.body);
    if (invalid) {
      const item = {
        ...req.body,
        ...(req.params.id ? { id: req.params.id } : {}),
      }; // gắn lại data cũ vào form
      return res.render("form", { item, error: invalid }); // item: for update get from URL
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