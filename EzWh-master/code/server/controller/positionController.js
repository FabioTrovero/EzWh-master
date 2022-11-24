'use strict'
const { password } = require('pg/lib/defaults');
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');

class PositionController{
    constructor() {}

    async getPositions(db) {
        const sql = "SELECT * FROM POSITION";
        let positions;
        try {
            positions = await db.get(sql, [], true);
        }
        catch (err) {
            throw {err: 500};
        }
        /*
        let array = positions.map((e) => (
            {
                positionID: e.POSITION,
                aisleID: e.ISLE,
                row: e.ROW,
                col: e.COL,
                maxWeight: e.MAXWEIGHT,
                maxVolume: e.MAXVOLUME,
                occupiedWeight: e.OCCUPIEDWEIGHT,
                occupiedVolume: e.OCCUPIEDVOLUME
            }
        ));*/
        return positions;
    }


    async createPosition(db, data) {
        if(data.maxWeight<0 || data.maxVolume <0)
        {
            throw {err: 422};
        }
        const sql = "INSERT INTO POSITION(ID, ISLE, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES(?, ?, ?, ?, ?, ?, 0, 0)";
        try {
            await db.query(sql, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume]);
        }
        catch (err) {
            throw {err: 503};
        }
    }



    async modifyPosition(db, data, positionID) {
        // Check that that positionID has a position associated to it
        const sql = "SELECT * FROM POSITION WHERE ID = ?";
        let position;
        let pos2;
        if(data.maxWeight<0 || data.maxVolume <0 || data.occupiedVolume <0 || data.occupiedWeight<0)
        {
            throw {err: 422};
        }
        try {
            position = await db.get(sql, [String(positionID)], false);
        }
        catch (err) {
            throw {err: 500};
        }
        if (position == undefined) {
            throw {err: 404};
        }

        try {
            pos2 = await db.get(sql, [String(data.positionID)], false);
        }
        catch (err) {
            throw {err: 500};
        }
        if(pos2!=undefined){throw{err:422}}
        
        
        // If it exists, then procede to change it
        const sql1 = "UPDATE POSITION SET ID = ?,ISLE = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ? WHERE ID = ?";
        try {
            await db.query(sql1, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, data.occupiedWeight, data.occupiedVolume,positionID]);
        }
        catch (err) {
            throw {err: 422};
        }
    }

    async modifyPositionIDOfPosition(db, data, positionID) {
        // Check that that positionID has a position associated to it
        const sql = "SELECT * FROM POSITION WHERE ID = ?";
        let position;
        try {
            position = await db.get(sql, [String(positionID)], false);
        }
        catch (err) {
            throw {err: 500};
        }
        if (position == undefined) {
            throw {err: 404};
        }
        let pos2;
        try {
            pos2 = await db.get(sql, [String(data.positionID)], false);
            if(pos2 != undefined){throw{err:422}}
        }
        catch (err) {
            throw err;
        }
        //
        // If it exists, then procede to change it
        const sql1 = "UPDATE POSITION SET ID = ?, ISLE = ?, ROW = ?, COL = ? WHERE ID = ?";
        try {
            let x = await db.query(sql1, [data.positionID, data.aisleID, data.row, data.col,String(positionID)]);
        }
        catch (err) {
            throw {err: 503};
        }
    }

    async deleteSKUItemInPosition(db, positionID) {
        const sql = "SELECT ID FROM SKU WHERE POSITIONID = ?";
        let SKUId;
        try {
            SKUId = await db.get(sql, [positionID], true);
        }
        catch (err) {
            throw {err: 503};
        }
        const sql1 = "DELETE FROM SKUITEM WHERE SKUID = ?";
        try {
            await db.query(sql1, [SKUId[0].ID]);
        }
        catch (err) {
            throw {err: 503};
        }
    }
    async deletePosition(db, positionID) {
        const sql = "SELECT * FROM POSITION WHERE ID = ?";
        let position;
        try {
            position = await db.get(sql, [String(positionID)], false);
        }
        catch (err) {
            throw {err: 500};
        }
        if (position == undefined) {
            throw {err: 404};
        }
        const sql2 = "SELECT * FROM SKU WHERE POSITIONID = ?";
        try {
            position = await db.get(sql2, [String(positionID)], false);
            if (position != undefined) {
                throw {err: 422};
            }
        }
        catch (err) {
            throw err;
        }

        const sql1 = "DELETE FROM POSITION WHERE ID = ?";
        try {
            await db.query(sql1, [positionID]);
        }
        catch (err) {
            throw {err: 503};
        }
        //set to null position id of the SKU???????
    }
    async resetTable(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS POSITION');
            res = await db.query('CREATE TABLE "POSITION" ( "ID" TEXT NOT NULL, "ISLE" TEXT NOT NULL, "ROW" TEXT NOT NULL, "COL" TEXT NOT NULL, "MAXWEIGHT" INTEGER NOT NULL, "MAXVOLUME" INTEGER NOT NULL, "OCCUPIEDWEIGHT" INTEGER NOT NULL, "OCCUPIEDVOLUME" INTEGER NOT NULL, PRIMARY KEY("ID","ISLE","ROW","COL") )')
        } catch (err) {
            throw err;
        }

    }
}

module.exports = PositionController;