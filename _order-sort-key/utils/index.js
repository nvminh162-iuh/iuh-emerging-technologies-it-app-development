// Tính subtotal
const computeSubtotal = (quantity, unitPrice) => {
  return Number(quantity) * Number(unitPrice);
};

// Tính phí vận chuyển: subtotal >= 500000 thì miễn phí, còn lại 30000
const computeShippingFee = (subtotal) => {
  return subtotal >= 500000 ? 0 : 30000;
};

// Tính thuế
const computeTax = (subtotal, taxRate) => {
  return subtotal * Number(taxRate) / 100;
};

// Tính tổng cuối: finalTotal = subtotal + shippingFee + taxAmount
const computeFinalTotal = (quantity, unitPrice, taxRate) => {
  const subtotal = computeSubtotal(quantity, unitPrice);
  const shippingFee = computeShippingFee(subtotal);
  const taxAmount = computeTax(subtotal, taxRate);
  const finalTotal = subtotal + shippingFee + taxAmount;
  return { subtotal, shippingFee, taxAmount, finalTotal };
};

// Tính nhãn ưu đãi lưu vào DynamoDB
const computeDiscountLabel = (category, quantity) => {
  const q = Number(quantity);
  if (category === 'Electronics' && q >= 3) return 'Được ưu đãi';
  if (category === 'Fashion' && q >= 5) return 'Được ưu đãi';
  return 'Không ưu đãi';
};

// Format tiền VND
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(value) || 0);
};

module.exports = {
  computeSubtotal,
  computeShippingFee,
  computeTax,
  computeFinalTotal,
  computeDiscountLabel,
  formatCurrency,
};
