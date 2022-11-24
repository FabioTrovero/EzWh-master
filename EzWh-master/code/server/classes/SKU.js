'use strict'
class SKU {

    constructor(ID, description, weight, volume, price, notes, quantity, positionID) {
        this.ID = ID;
        this.description = description;
        this.weight = weight,
        this.volume = volume,
        this.price = price;
        this.notes = notes,
        this.quantity = quantity,
        this.positionID = positionID
    }
}

module.exports = SKU;