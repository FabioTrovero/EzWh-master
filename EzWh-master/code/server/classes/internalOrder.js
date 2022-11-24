'use strict'
class InternalOrder{

    constructor(ID,date,state,products,customerId){
        this.ID = ID;
        this.date = date;
        this.state = state;
        this.products = products;
        this.customerId = customerId;
    }
}

module.exports = InternalOrder;
