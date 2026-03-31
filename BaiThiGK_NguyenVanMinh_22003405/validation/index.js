const validation = (item) => {
    const fee = Number(item?.fee);
    
    if (fee <= 0) return "Fee > 0";

    return null;
}

module.exports = { validation };