const validation = (item) => {
    
    const quantity = Number(item?.quantity);
    const unitPrice = Number(item?.unitPrice);
    const orderDate = new Date(item?.orderDate);

    if (quantity <= 0) return "quantity phải > 0 và là số nguyên"

    if (unitPrice <= 0) return "unitPrice phải > 0"

    if (orderDate < new Date().setHours(0, 0, 0, 0)) return "orderDate không được nhỏ hơn ngày hiện tại"

    return null;
}


module.exports = { validation };
