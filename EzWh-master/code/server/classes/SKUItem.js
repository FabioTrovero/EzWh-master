'use strict'
class SKUItem {

    constructor(ID, available, date, skuid) {
        this.ID = ID;
        this.available = available;
        this.date = date;
        this.skuid = skuid;
    }
}

module.exports = SKUItem;