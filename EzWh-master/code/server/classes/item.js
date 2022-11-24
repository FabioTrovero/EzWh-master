'use strict'
class Item{

    constructor(ID,description,price,SKUId,supplierId){
        this.ID = ID;
        this.description = description;
        this.price = price;
        this.SKUId = SKUId;
        this.supplierId = supplierId;
    }
}

module.exports = Item;
