'use strict'
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
const SKUController = require('./SKUController');
const IntO = require('../classes/internalOrder');

const SKU = new SKUController();


function IO(SKUID,description,price,quantity,RFID) {
    this.SKUID = SKUID;
    this.description=description;
    this.price=price;
    this.quantity = quantity;
    this.RFID = RFID;
}

class internalOrderController{
    constructor(){}

    async getInternalOrder(db){
        const sql = 'SELECT * FROM INTERNALORDER';
        let iorders = [];
        try{
            let io = await db.get(sql,[],true);
            for (let row of io){
                if(row.STATE === 'COMPLETED'){
                    let pList = [];
                const sql2 = 'SELECT SKUID,RFID FROM IOCOMPLETED WHERE IOID = ? ' 
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                        
                        let sku=await SKU.getSKUById(db,p.SKUID);
                        let newIO = new IO(p.SKUID,sku.DESCRIPTION,sku.PRICE,0,p.RFID); 
                        pList= pList.concat(newIO);
                }
                 iorders = iorders.concat(new IntO(row.ID,row.DATE,row.STATE,pList,row.CUSTOMERID));
            
                }
                catch(err){
                    console.log(err);
                    throw err;
                }

                }
                else{
                let pList = [];
                const sql2 = 'SELECT PRODUCTID,QUANTITY FROM INTERNALORDERPRODUCTS WHERE INTERNALORDERID = ? ' 
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                        
                        let sku=await SKU.getSKUById(db,p.PRODUCTID);
                        let newIO = new IO(p.PRODUCTID,sku.DESCRIPTION,sku.PRICE,p.QUANTITY,0); 
                        pList= pList.concat(newIO);
                }
                iorders = iorders.concat(new IntO(row.ID,row.DATE,row.STATE,pList,row.CUSTOMERID));

                }
                catch(err){
                    console.log(err)
                    throw err;
                }
                    
                }
                
            }
        }
        catch(err){
            throw err;
        }
        return iorders;
    }

    async getInternalOrderState(db,state){
        const sql = 'SELECT * FROM INTERNALORDER WHERE STATE = ?';
        let iorders = [];
        let pList = [];
        try{
            let io = await db.get(sql,[state],true);
            for (let row of io){
                const sql2 = 'SELECT PRODUCTID,QUANTITY FROM INTERNALORDERPRODUCTS WHERE INTERNALORDERID = ? ' 
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                        let sku=await SKU.getSKUById(db,p.PRODUCTID);
                        let newIO = new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,p.QUANTITY,0); 
                        pList= pList.concat(newIO);
                }
                iorders = iorders.concat(new IntO(row.ID,row.DATE,row.STATE,pList,row.CUSTOMERID));

                }
                catch(err){
                    pList = [];
                }
                    
                
                
            }
        }
        catch(err){
            throw err;
        }
        return iorders;
    }

    async getInternalOrderbyID(db,id){
        const sql = 'SELECT * FROM INTERNALORDER WHERE ID = ? ';
        let iorders;
        let pList = [];
        try{
            let row = await db.get(sql,[id],false);
            if(row == undefined)
            {throw 404}
                if(row.STATE === 'COMPLETED'){
                const sql2 = 'SELECT SKUID,RFID FROM IOCOMPLETED WHERE IOID = ? ' 
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                        let sku=await SKU.getSKUById(db,p.SKUID);
                        let newIO = new IO(p.SKUID,sku.DESCRIPTION,sku.PRICE,0,p.RFID); 
                        pList= pList.concat(newIO);
                }
                iorders = (new IntO(row.ID,row.DATE,row.STATE,pList,row.CUSTOMERID));

                
                }
                catch(err){
                    pList = [];
                }

                }
                else{
                let pList = [];
                const sql2 = 'SELECT PRODUCTID,QUANTITY FROM INTERNALORDERPRODUCTS WHERE INTERNALORDERID = ? ' 
                try{
                    let pid = await db.get(sql2,[row.ID],true);
                    for(let p of pid){
                        let sku=await SKU.getSKUById(db,p.PRODUCTID);
                        let newIO = new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,p.QUANTITY,0); 
                        pList= pList.concat(newIO);
                }
                iorders = (new IntO(row.ID,row.DATE,row.STATE,pList,row.CUSTOMERID));

                }
                catch(err){
                    pList = [];
                }
                    
                }
                
            
        }
        catch(err){
            throw err;
        }
        return iorders;
    }

    async storeInternalOrder(data,db){
        const sql = 'INSERT INTO INTERNALORDER(DATE,CUSTOMERID,STATE) VALUES(?,?,?)';
        const sid= data.products;
            try{
               let id = await db.query(sql, [data.issueDate, data.customerId,'ISSUED']);
               for(let d of sid){
                   
               const sql2 = 'INSERT INTO INTERNALORDERPRODUCTS(PRODUCTID,INTERNALORDERID,QUANTITY) VALUES(?,?,?)';
               try{
                   await db.query(sql2, [d.SKUId,id,d.qty]);
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

    async modifyState(data,db,id){
         try{
             await this.getInternalOrderbyID(db,id);
            
        }
        catch(err){
            throw err;
        } 
        const sql = "UPDATE INTERNALORDER SET STATE = ? WHERE ID = ?";
        try{
            await db.query(sql, [data.newState,id], true);
            
                if(data.newState === 'COMPLETED'){
                const sql2 = 'INSERT INTO IOCOMPLETED(IOID,SKUID,RFID) VALUES(?,?,?)';
                for(let s of data.products){
                try{
                    await db.query(sql2, [id,s.SkuID,s.RFID], true);
                }
                catch(err){
                    console.log(err)
                    throw err}  
                }
        }
    }
        catch(err){
            throw err}
            
    }

    async deleteInternalOrder(db,id){
        let state;
        try{
            await this.getInternalOrderbyID(db,id);
           
       }
       catch(err){
           throw 404;
       } 


        const sql1= "DELETE FROM INTERNALORDER WHERE ID = ?";
        try {
            await db.query(sql1, [id]);
        }
        catch (err) {
            throw  err;
        }

        const sql2= "DELETE FROM INTERNALORDERPRODUCTS WHERE INTERNALORDERID = ?";
        try {
            await db.query(sql2, [id]);
        }
        catch (err) {
            throw err;
        }
        if( state == 'COMPLETED'){
            const sql3= "DELETE FROM IOCOMPLETED WHERE IOID = ?";
            try{
                await db.query(sql3, [id]);
            }
            catch(err){
                throw err}  
            }


    }
    async resetTable(db){
        try {
            //INTERNAL ORDER TABLE
            let res = await db.query('DROP TABLE IF EXISTS INTERNALORDER');
            res = await db.query('CREATE TABLE "INTERNALORDER" ( "ID" INTEGER NOT NULL, "DATE" TEXT NOT NULL, "CUSTOMERID" INTEGER NOT NULL, "STATE" TEXT NOT NULL, PRIMARY KEY("ID" AUTOINCREMENT) );')
            
            //INTERNAL ORDER PRODUCT
            res = await db.query('DROP TABLE IF EXISTS INTERNALORDERPRODUCTS');
            res = await db.query('CREATE TABLE "INTERNALORDERPRODUCTS" ( "PRODUCTID" INTEGER NOT NULL, "INTERNALORDERID" INTEGER NOT NULL, "QUANTITY" INTEGER NOT NULL, PRIMARY KEY("PRODUCTID","INTERNALORDERID") );')
            
            //INTERNAL ORDER COMPLETED
            res = await db.query('DROP TABLE IF EXISTS IOCOMPLETED');
            res = await db.query('CREATE TABLE "IOCOMPLETED" ( "IOID" INTEGER NOT NULL, "SKUID" INTEGER NOT NULL, "RFID" TEXT NOT NULL, PRIMARY KEY("IOID","SKUID","RFID") );')

        } catch (err) {
            throw err;
        }
        

    }

}

module.exports = internalOrderController;