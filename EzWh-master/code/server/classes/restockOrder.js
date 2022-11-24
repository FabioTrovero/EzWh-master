'use strict'
const dayjs = require('dayjs');

class RestockOrder{

    constructor(ID,issueDate,state,products,transportNotes,supplierId,skuItems){
        this.ID = ID;
        this.issueDate = issueDate;
        this.state = state;
        this.products = products;
        if(transportNotes == undefined){this.transportNotes = [] }
        if(transportNotes === null){
            this.transportNotes = undefined ;

        }
        else{

            this.transportNotes = dayjs(transportNotes).format('YYYY/MM/DD') ;
        }
        this.supplierId = supplierId;
        this.skuItems = skuItems;
    }
}

module.exports = RestockOrder;
