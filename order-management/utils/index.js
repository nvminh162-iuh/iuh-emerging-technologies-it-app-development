const compute = (item) => {
  const quantity = Number(item?.quantity);
  const unitPrice = Number(item?.unitPrice);
  const taxRate = Number(item?.taxRate);
  const category = item?.category;

  // subtotal ban đầu
  let subtotal = quantity * unitPrice;

  // discount
  let discountRate = 0;
  if (category === "Electronics" && quantity >= 3) discountRate = 12;
  else if (category === "Fashion" && quantity >= 5) discountRate = 8;

  // nếu có giảm thì trừ luôn vào subtotal
  if (discountRate > 0) {
    subtotal = subtotal - (subtotal * discountRate) / 100;
  }

  // tax (tính trên subtotal đã giảm)
  const taxAmount = (subtotal * taxRate) / 100;

  // shipping
  let shippingFee = 30000;
  if (subtotal >= 500000) {
    shippingFee = 0;
  }

  // label
  const discountLabel = discountRate > 0 ? `Ưu đãi ${discountRate}%` : "Không được ưu đãi";

  // final
  const finalTotal = subtotal + taxAmount + shippingFee;

  return { subtotal, shippingFee, finalTotal, discountLabel };
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0);
};

module.exports = { compute, formatCurrency };
