'use strict'
const { password } = require('pg/lib/defaults');
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
const posController = require ('../controller/positionController')
const pos = new posController();

class SKUController{
    constructor() {}

    async getSKUs(db) {
        // Returns an array containing all SKUs.
        const sql = "SELECT * FROM SKU";
        let skus;
        try {
            skus = await db.get(sql, [], true);
        }
        catch(err) {
            (err);
            throw err;
        }
        // Now, we get the test descriptors
        const sql2 = "SELECT ID FROM TESTDESCRIPTOR WHERE SKUID = ?";
        for (let i = 0; i < skus.length; i++) {
            let elem = skus[i];
            try {
                let testDesc = await db.get(sql2, [elem.ID], true);
                (testDesc);
                let testDescArray = [];
                for (let j = 0; j < testDesc.length; j++) {
                    testDescArray.push(testDesc[j].ID);
                }
                elem.testDescriptors = testDescArray;
            }
            catch(err) {
                (err);
                throw err;
            }
        }
        // Finally, construct array and return
        /*
        let array = skus.map((e) => (
            {
                id: e.ID,
                description: e.DESCRIPTION,
                weight: e.WEIGHT,
                volume: e.VOLUME,
                notes: e.NOTES,
                position: e.POSITIONID,
                availableQuantity: e.QUANTITY,
                price: e.PRICE,
                testDescriptors: e.testDescriptors
            }
        ));
        return array;*/
        return skus;
    }

    async getSKUById(db, id) {
        // Returns an object describing the requested SKU
        const sql = "SELECT * FROM SKU WHERE ID = ?";
        let sku;
        try {
            sku = await db.get(sql, [id], false);
            if (sku == undefined) {
                throw {err: 404};
            }
        }
        catch (err) {
            throw err;
        }
        // Now, we need to get the test descriptors
         const sql2 = "SELECT ID FROM TESTDESCRIPTOR WHERE SKUID = ?";
        try {
            (sku.ID);
            let testDesc = await db.get(sql2, [sku.ID], true);
            let testDescArray = [];
            (testDesc);
            for (let j = 0; j < testDesc.length; j++) {
                testDescArray.push(testDesc[j].ID);
            }
            sku.testDescriptors = testDescArray;
        }
        catch (err) {
            (err);
            throw err;
        } 
        // Finally, construct array and return
        /*
        let array = sku.map((e) => (
            {
                id: e.ID,
                description: e.DESCRIPTION,
                weight: e.WEIGHT,
                volume: e.VOLUME,
                notes: e.NOTES,
                position: e.POSITIONID,
                availableQuantity: e.QUANTITY,
                price: e.PRICE
               // testDescriptors: e.testDescriptors
            }
        ));*/
        return sku;
    }

    async createSKU(db, sku) {

        if(sku.weight<0 || sku.volume <0 || sku.price<0 || sku.availableQuantity <0)
        {
            throw {err: 422};
        }
        const sql = "INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, QUANTITY) VALUES(?, ?, ?, ?, ?, ?)";
        try {
            await db.query(sql, [sku.description, sku.weight, sku.volume, sku.notes, sku.price, sku.availableQuantity]);
        }
        catch (err) {
            throw err;
        }
    }

    async modifySKU(db, sku, id) {
        const sql1 = "SELECT * FROM SKU WHERE ID = ?";
        let a;
        let positions;
        try {
            a = await db.get(sql1, [id], false);

        }
        catch (err) {
            (err);
            throw err;
        }
        if (a == undefined) {
            throw {err: 404};
        }
        if(a.POSITIONID !== null){
            try{
                let posid = String(a.POSITIONID);
                try {
                    const sql = "SELECT * FROM POSITION WHERE ID = ?";
                    positions = await db.get(sql, [posid], false);
                    if(positions == undefined)
                    {
                        throw {err: 404};
                    }}
                    catch (err) {
                        throw err;
                    }

                let totVolume = sku.newVolume * sku.newAvailableQuantity;
                let totWeight = sku.newWeight * sku.newAvailableQuantity;
                
                if(totVolume < positions.MAXVOLUME && totWeight<positions.MAXWEIGHT )
                {
                    
                    let d = ({
                        aisleID: positions.ISLE,
                        row: positions.ROW,
                        col: positions.COL,
                        maxWeight: positions.MAXWEIGHT,
                        maxVolume: positions.MAXVOLUME,
                        occupiedWeight: totWeight,
                        occupiedVolume: totVolume
                    });
                    let posid = String(a.POSITIONID);
                    await pos.modifyPosition(db,d,posid)
                }
                else{
                    throw {err:422};
                }

            }
            catch(err){
                throw err;
            }
        }

        const sql = "UPDATE SKU SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?, NOTES = ?, PRICE = ?, QUANTITY = ? WHERE ID = ?";
        try {
            await db.query(sql, [sku.newDescription, sku.newWeight, sku.newVolume, sku.newNotes, sku.newPrice, sku.newAvailableQuantity, id]);
        }
        catch (err) {
            throw {err: 503};
        }

    }

    async modifySKUPosition(db, position, id) {
        // Check that sku exists
        const sql1 = "SELECT * FROM SKU WHERE ID = ?";
        let a;
        try {
            a = await db.get(sql1, [id], false);
            
        }
        catch (err) {
            (err);
            throw err;
        }
        if (a== undefined) {
            throw {err: 404};
        }
        // Check position is available
        const sql2 = "SELECT * FROM POSITION WHERE ID = ?";
        let b;
        try {
            let str = String(position.position)
            b = await db.get(sql2, [str], false);
        }
        catch (err) {
            throw err;
        }
        if (b == undefined) {

            throw {err: 422};
        }

        try{
            let x=await this.getSKUs(db);
            if(x.filter(s=>(s.POSITIONID == position.position)).length != 0)
            {throw {err:422}}
            
        }
        catch(err){
            throw(err);
        }
        let totVolume = a.VOLUME * a.QUANTITY;
        let totWeight = a.WEIGHT * a.QUANTITY;
        if(totVolume <= b.MAXVOLUME && totWeight<=b.MAXWEIGHT )
        {
            const data = {
                positionID: b.ID,
                aisleID: b.ISLE,
                row: b.ROW,
                col: b.COL,
                maxWeight: b.MAXWEIGHT,
                maxVolume: b.MAXVOLUME,
                occupiedWeight: totWeight,
                occupiedVolume: totVolume
                }

                    const sql3 = "UPDATE POSITION SET ID = ?,ISLE = ?, ROW = ?, COL = ?, MAXWEIGHT = ?, MAXVOLUME = ?, OCCUPIEDWEIGHT = ?, OCCUPIEDVOLUME = ? WHERE ID = ?";
                    try {
                        await db.query(sql3, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, data.occupiedWeight, data.occupiedVolume,String(data.positionID)]);
                    }
                    catch (err) {
                        console.log(err);
                        throw err;
                    }

                
        }
        else{
            
            throw{err:422};
        }

        
        // Still some checks missing
        const sql = "UPDATE SKU SET POSITIONID = ? WHERE ID = ?";
        try {
            await db.query(sql, [position.position, id]);
        }
        catch (err) {
            (err);
            throw {err: 503};
        }
    }

    async deleteSKU(db, id) {
        // First check if SKU exists
        const sql = "SELECT * FROM SKU WHERE ID = ?";
        let a;
        try {
            a = await db.get(sql, [id], true);
        }
        catch (err) {
            (err);
            throw err;
        }
        if (a.length == 0) {
            throw {err: 404};
        }
        // If it exists, delete it
        const sql1 = "DELETE FROM SKU WHERE ID = ?";
        try {
            await db.query(sql1, [id]);
        }
        catch (err) {
            (err);
            throw {err: 503};
        }
    }
    async resetTable(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS SKU');
            res = await db.query('CREATE TABLE "SKU" ( "ID" INTEGER NOT NULL, "DESCRIPTION" TEXT NOT NULL, "WEIGHT" INTEGER NOT NULL, "VOLUME" INTEGER NOT NULL, "PRICE" REAL NOT NULL, "NOTES" TEXT, "QUANTITY" INTEGER NOT NULL, "POSITIONID" INTEGER, PRIMARY KEY("ID") )')
        } catch (err) {
            throw err;
        }

    }

}

module.exports = SKUController;