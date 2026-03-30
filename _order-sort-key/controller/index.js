const { service } = require("../service");
const { computeFinalTotal, computeDiscountLabel, formatCurrency } = require("../utils");
const { validation } = require("../validation");

const controller = {
  // GET / – Danh sách + bộ lọc 5 tiêu chí
  renderAll: async (req, res) => {
    const { productName, customerName, orderDateFrom, orderDateTo, paymentStatus } = req.query;
    let items = await service.findAll();

    if (productName) {
      const kw = productName.toLowerCase();
      items = items.filter((i) => i.productName?.toLowerCase().includes(kw));
    }
    if (customerName) {
      const kw = customerName.toLowerCase();
      items = items.filter((i) => i.customerName?.toLowerCase().includes(kw));
    }
    if (orderDateFrom) {
      items = items.filter((i) => i.orderDate >= orderDateFrom);
    }
    if (orderDateTo) {
      items = items.filter((i) => i.orderDate <= orderDateTo);
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      items = items.filter((i) => i.paymentStatus === paymentStatus);
    }

    return res.render("index", {
      items,
      query: req.query,
      computeFinalTotal,
      computeDiscountLabel,
      formatCurrency,
    });
  },

  // GET /form  hoặc  GET /form/:orderId/:orderDate
  renderForm: async (req, res) => {
    const { orderId, orderDate } = req.params;
    const item = orderId && orderDate ? await service.findById(orderId, orderDate) : null;
    return res.render("form", { item, error: null });
  },

  // GET /detail/:orderId/:orderDate
  renderDetail: async (req, res) => {
    const { orderId, orderDate } = req.params;
    const item = await service.findById(orderId, orderDate);
    if (!item) return res.status(404).send("Không tìm thấy đơn hàng");
    return res.render("detail", { item, computeFinalTotal, formatCurrency });
  },

  // POST /items  hoặc  POST /items/:orderId/:orderDate
  save: async (req, res) => {
    const invalid = validation(req.body);
    if (invalid) {
      const { orderId, orderDate } = req.params;
      const item = {
        ...req.body,
        ...(orderId ? { orderId } : {}),
        ...(orderDate ? { orderDate } : {}),
      };
      return res.render("form", { item, error: invalid });
    }
    try {
      const { orderId, orderDate } = req.params;
      await service.save(orderId, orderDate, req.body, req.file);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },

  // POST /items/delete/:orderId/:orderDate
  deleteById: async (req, res) => {
    try {
      const { orderId, orderDate } = req.params;
      await service.deleteById(orderId, orderDate);
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },
};

module.exports = { controller };
