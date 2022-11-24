'use strict'

const { ResultWithContext } = require("express-validator/src/chain");

function product(ID, DESCRIPTION, PRICE, QUANTITY) {
    this.ID = ID;
    this.DESCRIPTION = DESCRIPTION;
    this.PRICE = PRICE;
    this.QUANTITY = QUANTITY;
}
class restockOrderService {
    constructor(dao) { this.dao = dao };
    getAllresO = async (db) => {
        let result = [];
        try {
            let io = await this.dao.getRestockOrder(db);
            for (let row of io) {
                if (row.transportNotes === undefined) {
                    result = result.concat(
                        {
                            id: row.ID,
                            issueDate: row.issueDate,
                            state: row.state,
                            products: row.products.map((e) => (
                                {
                                    SKUId: e.ID, itemId: e.ITEMID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QUANTITY

                                }
                            )),
                            supplierId: row.supplierId,
                            skuItems: row.skuItems.map((e) => (
                                {
                                    SKUId: e.SKUId, itemId: e.ItemId, rfid: e.rfid

                                }))
                        }
                    )

                }
                else {
                    let delDate = row.transportNotes;
                    let delDate1 = ({ deliveryDate: delDate });
                    result = result.concat(
                        {
                            id: row.ID,
                            issueDate: row.issueDate,
                            state: row.state,
                            products: row.products.map((e) => (
                                {
                                    SKUId: e.ID, itemId: e.ITEMID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QUANTITY

                                }
                            )),
                            supplierId: row.supplierId,
                            trasportNote: delDate1,
                            skuItems: row.skuItems.map((e) => (
                                {
                                    SKUId: e.SKUId, itemId: e.ItemId, rfid: e.rfid

                                }))
                        }
                    )
                }
            }
            return result;

        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    getResObyId = async (db, id) => {
        let result = [];
        try {
            let row = await this.dao.getRestockOrderbyID(db, id);

            if (row.transportNotes === undefined) {

                result = (
                    {
                        id: row.ID,
                        issueDate: row.issueDate,
                        state: row.state,
                        products: ((row.products.length > 0) ? row.products.map((e) => (
                            {
                                SKUId: e.ID, itemId: e.ITEMID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QUANTITY

                            }
                        )) : []),
                        supplierId: row.supplierId,
                        skuItems: row.skuItems.map((e) => (
                            {
                                SKUId: e.SKUId, itemId: e.ItemId, rfid: e.rfid

                            }))
                    });
            }
            else {
                let delDate = row.transportNotes;
                let delDate1 = ({ deliveryDate: delDate });
                result = (
                    {
                        id: row.ID,
                        issueDate: row.issueDate,
                        state: row.state,
                        products: row.products.map((e) => (
                            {
                                SKUId: e.ID, itemId: e.ITEMID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QUANTITY

                            }
                        )),
                        supplierId: row.supplierId,
                        trasportNote: delDate1,
                        skuItems: row.skuItems.map((e) => (
                            {
                                SKUId: e.SKUId, itemId: e.ItemId, rfid: e.rfid

                            }))
                    });

            }
            return result;

        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    getresObyState = async (db, state) => {
        let result = [];
        try {
            let io = await this.dao.getRestockOrderIssued(db, state);
            for (let row of io) {
                if (row.transportNotes === undefined) {
                    result = result.concat(
                        {
                            id: row.ID,
                            issueDate: row.issueDate,
                            state: row.state,
                            products: row.products.map((e) => (
                                {
                                    SKUId: e.ID, itemId: e.ITEMID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QUANTITY

                                }
                            )),
                            supplierId: row.supplierId,
                            skuItems: row.skuItems.map((e) => (
                                {
                                    SKUId: e.SKUId, itemId: e.ItemId, rfid: e.rfid

                                }))
                        }
                    )

                }
                else {

                    let delDate = row.transportNotes;
                    let delDate1 = ({ deliveryDate: delDate });
                    result = result.concat(
                        {
                            id: row.ID,
                            issueDate: row.issueDate,
                            state: row.state,
                            products: row.products.map((e) => (
                                {
                                    SKUId: e.ID, itemId: e.ITEMID, description: e.DESCRIPTION, price: e.PRICE, qty: e.QUANTITY

                                }
                            )),
                            supplierId: row.supplierId,
                            trasportNote: delDate1,
                            skuItems: row.skuItems.map((e) => (
                                {
                                    SKUId: e.SKUId, itemId: e.ItemId, rfid: e.rfid

                                }))
                        }
                    )
                }
            }

            return result;

        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }


    store = async (data, db) => {
        try {
            await this.dao.storeRestockOrder(data, db);
        }
        catch (err) { throw err; }

    }

    getItems = async (db, id) => {
        try {
            return await this.dao.returnItemsNOQt(db, id);
        }
        catch (err) { throw err; }
    }

    updateItems = async (db, id, data) => {
        try {
            await this.dao.addSKUItems(db, id, data);
        }
        catch (err) { throw err; }
    }

    updateState = async (db, id, newState) => {
        try {
            await this.dao.modifyState(db, id, newState);
        }
        catch (err) { throw err; }
    }

    updateTN = async (db, id, trasportNote) => {
        try {
            await this.dao.addTradportNote(db, id, trasportNote);
        }
        catch (err) { throw err; }
    }

    delete = async (db, id) => {
        try {
            await this.dao.deleteRestockOrder(db, id);
        }
        catch (err) { throw err; }
    }

}
module.exports = restockOrderService;