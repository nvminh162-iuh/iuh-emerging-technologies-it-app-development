const validation = (item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    if (quantity < 0) {
        return "Quantity >= 0";
    }
    if (price < 0) {
        return "Price >= 0";
    }
    return null;
}

module.exports = { validation };