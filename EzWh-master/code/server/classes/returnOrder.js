'use strict'
class ReturnOrder{

    constructor(ID,returnDate,products,restockOrderId){
        this.ID = ID;
        this.returnDate = returnDate;
        this.products = products;
        this.restockOrderId = restockOrderId;
    }
}

module.exports = ReturnOrder;
