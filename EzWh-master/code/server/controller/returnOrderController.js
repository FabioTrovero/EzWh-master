'use strict'
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
const SKUController = require('./SKUController');
const retO = require('../classes/returnOrder');
const resOcontroller = require('../controller/restockOrderController')
const SKU = new SKUController();
const resO = new resOcontroller();

function product(SKUID,description,price,RFID) {
    this.SKUID = SKUID;
    this.description=description;
    this.price=price;
    this.RFID = RFID;
}
function productWithItemId(SKUID,description,price,RFID, ITEMID) {
    this.SKUID = SKUID;
    this.description=description;
    this.price=price;
    this.RFID = RFID;
    this.ITEMID = ITEMID;
}

class returnOrderController{
    constructor(){}


    async getReturnOrder(db){
        const sql = 'SELECT * FROM RETURNORDER';
        let roList = [];
        try{
            let ro = await db.get(sql,[],true);
            for (let row of ro){
                let pList = [];
                const sql2 = 'SELECT PRODUCTID,RFID,ITEMID FROM RETURNORDERPRODUCT WHERE RETURNORDERID = ? ' 
            
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                            try{

                                let sku=await SKU.getSKUById(db,p.PRODUCTID);
                                let p1 = new productWithItemId(sku.ID,sku.DESCRIPTION,sku.PRICE,p.RFID,p.ITEMID); 
                                pList= pList.concat(p1);
                                
                            }
                            catch(err){roList=[]}
                    }
                    roList = roList.concat(new retO(row.ID,row.DATE,pList,row.RESTOCKORDERID));
                
                }
                catch(err){
                    
                    throw err;
                }
            }
        }
        catch(err){
            throw err;
        }
        return roList;
    }

    async getReturnOrderbyID(db,id){
        const sql = 'SELECT * FROM RETURNORDER WHERE ID = ?';
        let roList = [];
        try{
            let row = await db.get(sql,[id],false);
            if(row == undefined)
                throw 404;
                let pList = [];
                const sql2 = 'SELECT PRODUCTID,RFID,ITEMID FROM RETURNORDERPRODUCT WHERE RETURNORDERID = ? ' 
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                            try{
                                let sku=await SKU.getSKUById(db,p.PRODUCTID);
                                let p1 = new productWithItemId(sku.ID,sku.DESCRIPTION,sku.PRICE,p.RFID,p.ITEMID); 
                                pList= pList.concat(p1);
                                
                            }
                            catch(err){throw err}
                    }
                    roList = new retO(row.ID,row.DATE,pList,row.RESTOCKORDERID);
                }
                catch(err){
                    throw err;
                }
        }
        catch(err){
            throw err;
        }
        return roList;
    }

    async storeReturnOrder(data,db){


        const sid = data.products;

        try{
            await resO.getRestockOrderbyID(db,data.restockOrderId);
        }
        catch(err){
            throw err;
        }
        for (let x of sid) {

            try {
                await SKU.getSKUById(db, x.SKUId);
            }
            catch (err) {
                throw { err: 404 };

            }
        }

        for (let d of data.products) {
            

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

             

        const sql = 'INSERT INTO RETURNORDER(DATE,RESTOCKORDERID) VALUES(?,?)';
            try{
                let id = await db.query(sql, [data.returnDate,data.restockOrderId]);
                for(let d of sid){
                
                const sql2 = 'INSERT INTO RETURNORDERPRODUCT(RETURNORDERID,PRODUCTID,QUANTITY,RFID,ITEMID) VALUES(?,?,?,?,?)';
                try{
                    await db.query(sql2, [id,d.SKUId,1,d.RFID,d.itemId]);
                 }
                 catch(err)
                 {
                    throw err;       
                          }
             }
             }             
             catch(err)
             {
                throw err;
             }
    }

    
    async deleteReturnOrderbyId(id,db){
        const sql = "SELECT * FROM RETURNORDER WHERE ID = ?";
        let a;
        try {
            a = await db.get(sql, [id], false);
            if (a == undefined) {
                throw 404;
            }
        }
        catch (err) {
            throw err;
        }


        const sql1= "DELETE FROM RETURNORDER WHERE ID = ?";
        try {
            await db.query(sql1, [id]);
        }
        catch (err) {
            throw {err: 503};
        }
        
        const sql2= "DELETE FROM RETURNORDERPRODUCT WHERE RETURNORDERID = ?";
        try {
            await db.query(sql2, [id]);
        }
        catch (err) {
            
            throw 503;
        }


    }
    async resetTable(db){
        try {
            //RETURN ORDER TABLE
            let res = await db.query('DROP TABLE IF EXISTS RETURNORDER');
            res = await db.query('CREATE TABLE "RETURNORDER" ( "ID" INTEGER NOT NULL, "DATE" TEXT NOT NULL, "RESTOCKORDERID" INTEGER NOT NULL, PRIMARY KEY("ID" AUTOINCREMENT) );')
            
            //RETURN ORDER PRODUCT
            res = await db.query('DROP TABLE IF EXISTS RETURNORDERPRODUCT');
            res = await db.query('CREATE TABLE "RETURNORDERPRODUCT" ( "RETURNORDERID" INTEGER NOT NULL, "PRODUCTID" INTEGER NOT NULL, "QUANTITY" INTEGER NOT NULL, "RFID" TEXT NOT NULL, "ITEMID" INTEGER NOT NULL, PRIMARY KEY("RETURNORDERID","PRODUCTID","RFID","ITEMID") );')
            
        } catch (err) {
            throw err;
        }
        

    }

}
module.exports = returnOrderController;