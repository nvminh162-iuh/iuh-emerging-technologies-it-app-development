const computeAmount = (price, quantity) => {
    return Number(price) * Number(quantity);
}

const statusLabel = (quantity) => {
    if (quantity === 0) return "Hết vé";
    else if (quantity <= 10) return "Sắp hết vé"
    else return "Còn vé";
}

module.exports = { computeAmount, statusLabel }