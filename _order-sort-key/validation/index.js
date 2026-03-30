const VALID_CATEGORIES = ['Electronics', 'Fashion', 'Food'];
const VALID_PAYMENT_STATUSES = ['Pending', 'Paid', 'Refunded'];

const validation = (body) => {
  const quantity = Number(body.quantity);
  const unitPrice = Number(body.unitPrice);
  const taxRate = Number(body.taxRate);
  const orderDate = body.orderDate || '';
  const category = body.category || '';
  const paymentStatus = body.paymentStatus || '';

  if (!body.customerName || body.customerName.trim().length === 0)
    return 'Customer Name là bắt buộc';

  if (!body.productName || body.productName.trim().length === 0)
    return 'Product Name là bắt buộc';

  // quantity phải > 0 và là số nguyên
  if (!body.quantity || quantity <= 0 || !Number.isInteger(quantity))
    return 'Quantity phải là số nguyên và > 0';

  // unitPrice phải > 0
  if (!body.unitPrice || unitPrice <= 0)
    return 'Unit Price phải > 0';

  // taxRate >= 0
  if (body.taxRate === '' || body.taxRate === undefined || taxRate < 0)
    return 'Tax Rate phải >= 0';

  // orderDate không được nhỏ hơn ngày hiện tại
  if (!orderDate) return 'Order Date là bắt buộc';
  const today = new Date().toISOString().split('T')[0];
  if (orderDate < today) return 'Order Date không được nhỏ hơn ngày hiện tại';

  // category enum
  if (!VALID_CATEGORIES.includes(category))
    return 'Category chỉ nhận: Electronics / Fashion / Food';

  // paymentStatus enum
  if (!VALID_PAYMENT_STATUSES.includes(paymentStatus))
    return 'Payment Status chỉ nhận: Pending / Paid / Refunded';

  return null;
};

module.exports = { validation };
