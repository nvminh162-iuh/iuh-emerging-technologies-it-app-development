const validate = (item) => {
    const quantity = Number(item?.quantity);
    const pricePerTicket = Number(item?.pricePerTicket);
    const eventDate = new Date(item?.eventDate);

    if (quantity <= 0) {
        return "Quantity > 0";
    }

    if (pricePerTicket <= 0) {
        return "pricePerTicket > 0";
    }

    const today = new Date().setHours(0, 0, 0, 0);

    if (eventDate < today) {
        return "Event date cannot be earlier than today";
    }

    return null;
}

module.exports = { validate };