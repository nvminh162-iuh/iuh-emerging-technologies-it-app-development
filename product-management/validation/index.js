const validation = (item) => {
    const name = item?.name || "";
    const customer = item?.customer || "";
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    if (name.length <= 5) {
        return "Customer > 5 ký tự";
    }
    if (customer.length <= 5) {
        return "Customer > 5 ký tự";
    }
    if (quantity < 0) {
        return "Quantity >= 0";
    }
    if (price < 0) {
        return "Price >= 0";
    }
    return null;
}

module.exports = { validation };