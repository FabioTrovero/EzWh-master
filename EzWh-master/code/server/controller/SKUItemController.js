'use strict'
const { password } = require('pg/lib/defaults');
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');

class SKUItemController{
    constructor() {}

    async getSKUItems(db) {
        const sql = "SELECT * FROM SKUITEM";
        let items;
        try {
            items = await db.get(sql, [], true);
        }
        catch (err) {
            console.log(err);
            throw {err: 500};
        }
        /*
        let array = items.map((e) => (
            {
                RFID: e.RFID,
                SKUId: e.SKUID,
                Available: e.AVAILABLE,
                DateOfStock: e.DATE
            }
        ));*/
        return items;
    }

    async getAvailableSKUItemsBySKUId(db, skuid) {
        const sql = "SELECT * FROM SKUITEM WHERE AVAILABLE = ? AND SKUID = ?";
        let items;
        try {
            items = await db.get(sql, [1,skuid], true);
        }
        catch (err) {
            console.log(err);
            throw {err: 500};
        }
        if (items.length == 0) {
            throw {err: 404};
        }
        /*
        let array = items.map((e) => (
            {
                RFID: e.RFID,
                SKUId: e.SKUID,
                DateOfStock: e.DATE
            }
        ));
        */
        return items;        
    }

    async getSKUItemByRFID(db, rfid) {
        const sql = "SELECT * FROM SKUITEM WHERE RFID = ?";
        let items;
        try {
            items = await db.get(sql, [rfid], true);
        }
        catch (err) {
            console.log(err);
            throw {err: 500};
        }
        if (items.length == 0) {
            throw {err: 404};
        }
        return items[0];
    }

    async createSKUItem(db, data) {
        // First, check that SKU associated to SKUId actually exists
        const sql = "SELECT * FROM SKU WHERE ID = ?";
        let sku;
        try {
            sku = await db.get(sql, [data.SKUId], true);
        }
        catch (err) {
            console.log(err);
            throw {err: 500};
        }
        if (sku.length == 0) {
            throw {err: 404};
        }
        // If it exists, create SKU Item
        const sql2 = "INSERT INTO SKUITEM(RFID, AVAILABLE, DATE, SKUID) VALUES(?, 0, ?, ?)";
        try {
            await db.query(sql2, [data.RFID, data.DateOfStock, data.SKUId]);
        }
        catch (err) {
            console.log(err);
            throw {err: 503};
        }
    }

    async modifySKUItem(db, data, rfid) {
        // First, check that SKU associated to SKUId actually exists
        const sql = "SELECT * FROM SKUITEM WHERE RFID = ?";
        let sku;
        try {
            sku = await db.get(sql, [rfid], true);
        }
        catch (err) {
            console.log(err);
            throw {err: 503};
        }
        if (sku.length == 0) {
            throw {err: 404};
        }
        // If it exists, modify SKU Item
        const sql2 = "UPDATE SKUITEM SET RFID = ?, AVAILABLE = ?, DATE = ? WHERE RFID = ?";
        try {
            await db.query(sql2, [data.RFID, data.Available, data.DateOfStock, rfid]);
        }
        catch (err) {
            console.log(err);
            throw {err: 503};
        }
    }

    async deleteSKUItem(db, rfid) {
        const sql1 = "SELECT * FROM SKUITEM WHERE RFID = ?";
        let sku;
        try {
            sku = await db.get(sql1, [rfid], true);
        }
        catch (err) {
            console.log(err);
            throw {err: 503};
        }
        if (sku.length == 0) {
            throw {err: 404};
        }
        const sql = "DELETE FROM SKUITEM WHERE RFID = ?";
        try {
            await db.query(sql, [rfid]);
        }
        catch (err) {
            console.log(err);
            throw {err: 503};
        }
    }
    async resetTable(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS SKUITEM');
            res = await db.query('CREATE TABLE "SKUITEM" ( "RFID" TEXT NOT NULL, "AVAILABLE" INTEGER NOT NULL, "DATE" TEXT NOT NULL, "SKUID" INTEGER NOT NULL, PRIMARY KEY("RFID") )')
        } catch (err) {
            throw err;
        }

    }
}

module.exports = SKUItemController;