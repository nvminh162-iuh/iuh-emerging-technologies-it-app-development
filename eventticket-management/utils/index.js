const compute = (item) => {
    const quantity = Number(item?.quantity);
    const pricePerTicket = Number(item?.pricePerTicket);
    const category = item?.category;

    const amount = quantity * pricePerTicket;
    
    let discountRate = 0;
    if (category === "VIP" && quantity >= 4) discountRate = 0.1;
    if (category === "VVIP" && quantity >= 2) discountRate = 0.15;

    const finalAmount = amount * (1-discountRate);

    const discountLabel = discountRate > 0 ? "Được giảm giá" : "Không được giảm"

    return { amount, finalAmount, discountLabel };
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(value) || 0);
}

module.exports = { compute, formatCurrency }