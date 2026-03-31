
const compute = (items = []) => {
  const result = {
    ALL: { count: 0, fee: 0 },
    PENDING: { count: 0, fee: 0 },
    CONFIRMED: { count: 0, fee: 0 },
    DONE: { count: 0, fee: 0 },
  };

  items.forEach((item) => {
    const status = item.status?.toUpperCase();
    const fee = Number(item.fee) || 0;

    if (status !== "CANCELLED") {
      result.ALL.count++;
      result.ALL.fee += fee;

      if (result[status]) {
        result[status].count++;
        result[status].fee += fee;
      }
    }
  });

  return result;
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(value) || 0);
}

module.exports = { compute, formatCurrency }