'use strict'
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
const SKUController = require('./SKUController');
const TRcontroller = require('./testResultController');
const resO = require('../classes/restockOrder');
const SKU = new SKUController();
const TR = new TRcontroller();

function product(ID, DESCRIPTION, PRICE, QUANTITY) {
    this.ID = ID;
    this.DESCRIPTION = DESCRIPTION;
    this.PRICE = PRICE;
    this.QUANTITY = QUANTITY;
}

function productWithItemId(ID, DESCRIPTION, PRICE, QUANTITY, ITEMID) {
    this.ID = ID;
    this.DESCRIPTION = DESCRIPTION;
    this.PRICE = PRICE;
    this.QUANTITY = QUANTITY;
    this.ITEMID = ITEMID;
}

class restockOrderController {

    constructor() { }
    async storeRestockOrder(data, db) {

        const sid = data.products;

        for (let x of sid) {

            try {
                await SKU.getSKUById(db, x.SKUId);
            }
            catch (err) {
                throw { err: 404 };

            }
        }

        for (let d of data.products) {
            // CHECK SUPPLIER SELL ITEM

            const sql4 = 'SELECT * FROM ITEM WHERE SUPPLIERID = ? AND ID = ?'

            try {
                let supplier = await db.get(sql4, [data.supplierId, d.itemId], true);
                if (supplier.length == 0) {
                    throw { err: 422 };
                }
            }
            catch (err) {
                throw err;
            }

            //CHECK ITEM CORRESPOND TO SKUID

            const sql5 = 'SELECT * FROM ITEM WHERE SKUID = ? AND ID = ?'

            try {
                let item = await db.get(sql5, [d.SKUId, d.itemId], true);
                if (item.length == 0) {
                    throw { err: 422 };
                }
            }
            catch (err) {
                throw err;
            }
        }






        for (let d of data.products) {
            if (d.price < 0 || d.qty < 0) {
                throw { err: 404 };
            }
        }
        const sql = 'INSERT INTO RESTOCKORDER(DATE,STATE,SUPPLIERID,TRANSPORTNOTE) VALUES(?,?,?,?)';
        try {
            let id = await db.query(sql, [data.issueDate, "ISSUED", data.supplierId, undefined]);
            for (let d of data.products) {

                const sql2 = 'INSERT INTO RESTOCKORDERPRODUCT(RESTOCKORDERID,PRODUCTID,QUANTITY,ITEMID) VALUES(?,?,?,?)';
                try {
                    await db.query(sql2, [id, d.SKUId, d.qty, d.itemId]);
                }
                catch (err) {
                    throw err;
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    async getRestockOrder(db) {

        const sql = 'SELECT * FROM RESTOCKORDER';
        let roList = [];
        let pList = [];
        let iList = [];
        try {
            let ro = await db.get(sql, [], true);
            for (let row of ro) {
                pList = [];
                const sql2 = 'SELECT PRODUCTID,QUANTITY,ITEMID FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ? '
                const sql3 = 'SELECT PRODUCTID,SKUID,RFID FROM RESTOCKORDERITEM WHERE RESTOCKORDERID = ? '

                try {
                    let pid = await db.get(sql2, [row.ID], true);
                    for (let p of pid) {

                        let sku = await SKU.getSKUById(db, p.PRODUCTID);

                        pList = pList.concat(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, p.QUANTITY, p.ITEMID));


                    }

                }
                catch (err) {
                    pList = [];
                }

                //SEARCH FOR ITEM

                try {
                    let pid = await db.get(sql3, [row.ID], true);
                    if (pid == undefined) {
                        iList = [];
                    }
                    else {
                        for (let p of pid) {
                            console.log(p);
                            iList = iList.concat(p);
                        }

                    }
                }
                catch (err) {
                    iList = [];
                }
                roList = roList.concat(new resO(row.ID, row.DATE, row.STATE, pList, row.TRANSPORTNOTE, row.SUPPLIERID, iList.map(r => ({ SKUId: r.SKUID, ItemId: r.PRODUCTID, rfid: r.RFID }))));
            }
        }
        catch (err) {
            throw err;
        }
        return roList;

    }

    async getRestockOrderIssued(db, state) {

        const sql = 'SELECT * FROM RESTOCKORDER WHERE STATE = ?';
        let roList = [];
        let pList = [];
        let iList = [];
        try {
            let ro = await db.get(sql, [state], true);
            for (let row of ro) {
                pList = [];
                const sql2 = 'SELECT PRODUCTID,QUANTITY,ITEMID FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ? '
                const sql3 = 'SELECT PRODUCTID,SKUID,RFID FROM RESTOCKORDERITEM WHERE RESTOCKORDERID = ? '

                try {
                    let pid = await db.get(sql2, [row.ID], true);
                    for (let p of pid) {

                        let sku = await SKU.getSKUById(db, p.PRODUCTID);

                        pList = pList.concat(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, p.QUANTITY, p.ITEMID));


                    }

                }
                catch (err) {
                    pList = [];
                }

                //SEARCH FOR ITEM

                try {
                    let pid = await db.get(sql3, [row.ID], true);
                    if (pid == undefined) {
                        iList = [];
                    }
                    else {
                        for (let p of pid) {
                            console.log(p);
                            iList = iList.concat(p);
                        }

                    }
                }
                catch (err) {
                    iList = [];
                }
                roList = roList.concat(new resO(row.ID, row.DATE, row.STATE, pList, row.TRANSPORTNOTE, row.SUPPLIERID, iList.map(r => ({ SKUId: r.SKUID, ItemId: r.PRODUCTID, rfid: r.RFID }))));
            }
        }
        catch (err) {
            throw err;
        }
        return roList;

    }
    async getRestockOrderbyID(db, id) {

        const sql = 'SELECT * FROM RESTOCKORDER WHERE ID = ?';
        let roList;
        let pList = [];
        let iList = [];
        try {
            let row = await db.get(sql, [id], false);
            if (row == undefined) { throw { err: 404 }; }

            const sql2 = 'SELECT PRODUCTID,QUANTITY,ITEMID FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ? '
            const sql3 = 'SELECT PRODUCTID,SKUID,RFID FROM RESTOCKORDERITEM WHERE RESTOCKORDERID = ? '

            try {
                let pid = await db.get(sql2, [id], true);
                for (let p of pid) {

                    let sku = await SKU.getSKUById(db, p.PRODUCTID);

                    pList = pList.concat(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, p.QUANTITY, p.ITEMID));


                }

            }
            catch (err) {
                pList = [];
            }

            //SEARCH FOR ITEM

            try {
                let pid = await db.get(sql3, [id], true);
                for (let p of pid) {

                    iList = iList.concat(p);
                }
            }
            catch (err) {
                iList = []
            }
            roList = new resO(row.ID, row.DATE, row.STATE, pList, row.TRANSPORTNOTE, row.SUPPLIERID, iList.map(r => ({ SKUId: r.SKUID, ItemId: r.PRODUCTID, rfid: r.RFID })));
        }

        catch (err) {
            throw err;
        }
        return roList;

    }




    async addSKUItems(db, id, data) {

        try {
            let x = await this.getRestockOrderbyID(db, id);
            if (x.state != 'DELIVERED') {
                throw 422;
            }
        }
        catch (err) {
            console.log(err)
            if (err.err == 404) { throw { err: 404 } }
            else { throw 422; }
        }

        const sql = 'INSERT INTO RESTOCKORDERITEM(RESTOCKORDERID,SKUID,PRODUCTID,RFID) VALUES(?,?,?,?)';

        const sid = data;
        try {
            for (let d of sid) {
                await db.query(sql, [id, d.SKUId, d.itemId, d.rfid]);
            }
        }
        catch (err) {
            console.log(err)
            throw 503;
        }


    }




    async returnItemsNOQt(db, id) {
        try {

            let x = await this.getRestockOrderbyID(db, id);
            if (x.state === 'COMPLETEDRETURN')
                throw { err: 422 };
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        const sql = 'SELECT PRODUCTID,SKUID,RFID FROM RESTOCKORDERITEM WHERE RESTOCKORDERID = ? '
        let iList = [];
        try {
            let pid = await db.get(sql, [id], true);
            if (pid.length == 0) {
                throw { err: 404 };
            }

            for (let p of pid) {

                try {

                    let r = await TR.getTestResultByRFID(db, p.RFID);
                    for (let re of r) {
                        if (re.result === 0) {
                            const sql = 'SELECT PRODUCTID,SKUID,RFID FROM RESTOCKORDERITEM WHERE RESTOCKORDERID = ? AND SKUID = ?'

                            try {
                                let sku = await db.get(sql, [id, p.SKUID], true);

                                sku.forEach(e => {
                                    iList.push(e);
                                    
                                });
                            }
                            catch (err) {
                                throw err
                            }

                            iList = iList.map(l => (
                                {
                                    SKUId: l.SKUID, itemId: l.PRODUCTID, rfid: l.RFID

                                }));

                                console.log(iList)

                        }

                    }

                }
                catch (err) { throw err }
            }

        }
        catch (err) {
            throw err;
        }
        return iList;

    }

    async modifyState(db, id, newState) {

        try {
            await this.getRestockOrderbyID(db, id);
        }
        catch (err) {
            throw { err: 404 }
        }
        const sql = "UPDATE RESTOCKORDER SET STATE = ? WHERE ID = ?";
        try {
            await db.get(sql, [newState, id], true);
        }

        catch (err) {
            throw 503;
        }


    }

    async addTradportNote(db, id, trasportNote) {

        try {
            let x = await this.getRestockOrderbyID(db, id);
            if (x.state != 'DELIVERY') {
                throw 422;
            }
        }
        catch (err) {
            console.log(err)
            if (err.err == 404) { throw err }
            else { throw 422; }
        }
        const sql = "UPDATE RESTOCKORDER SET TRANSPORTNOTE = ? WHERE ID = ?";
        try {
            await db.get(sql, [trasportNote, id], true);
        }

        catch (err) {
            throw err;
        }
    }


    async deleteRestockOrder(db, id) {
        // First check if INTERNALORDER exists
        try {

            await this.getRestockOrderbyID(db, id);
        }
        catch (err) {
            console.log(err)
            throw 404;
        }


        const sql1 = "DELETE FROM RESTOCKORDER WHERE ID = ?";
        try {
            await db.query(sql1, [id]);
        }
        catch (err) {
            console.log(err)
            throw 503;
        }

        const sql2 = "DELETE FROM RESTOCKORDERPRODUCT WHERE RESTOCKORDERID = ?";
        try {
            await db.query(sql2, [id]);
        }
        catch (err) {
            throw 503;
        }

        const sql3 = "DELETE FROM RESTOCKORDERITEM WHERE RESTOCKORDERID = ?";
        try {
            await db.query(sql3, [id]);
        }
        catch (err) {
            throw 503;
        }




    }
    async resetTable(db) {
        try {
            //RESTOCK ORDER TABLE
            let res = await db.query('DROP TABLE IF EXISTS RESTOCKORDER');
            res = await db.query('CREATE TABLE "RESTOCKORDER" ( "ID" INTEGER NOT NULL, "DATE" TEXT NOT NULL, "STATE" TEXT NOT NULL, "SUPPLIERID" INTEGER NOT NULL, "TRANSPORTNOTE" TEXT, PRIMARY KEY("ID" AUTOINCREMENT) );')
            //RESTOCK ORDER ITEM
            res = await db.query('DROP TABLE IF EXISTS RESTOCKORDERITEM');
            res = await db.query('CREATE TABLE "RESTOCKORDERITEM" ( "RESTOCKORDERID" INTEGER NOT NULL, "SKUID" INTEGER NOT NULL, "PRODUCTID" INTEGER NOT NULL, "RFID" TEXT NOT NULL, PRIMARY KEY("RESTOCKORDERID","SKUID","PRODUCTID","RFID") )')

            //RESTOCK ORDER PRODUCT
            res = await db.query('DROP TABLE IF EXISTS RESTOCKORDERPRODUCT');
            res = await db.query('CREATE TABLE "RESTOCKORDERPRODUCT" ( "RESTOCKORDERID" INTEGER NOT NULL, "PRODUCTID" INTEGER NOT NULL, "QUANTITY" INTEGER NOT NULL, "ITEMID" INTEGER NOT NULL, PRIMARY KEY("RESTOCKORDERID","PRODUCTID","ITEMID") )')


        } catch (err) {
            throw err;
        }


    }


}



module.exports = restockOrderController;