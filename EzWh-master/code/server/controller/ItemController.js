'use strict'
const Item = require('../classes/item');
const SKUController = require('../controller/SKUController');

const SKU = new (SKUController);

class Icontroller{
    constructor(){};
    
    async getStoreItem(db) {
        const sql = 'SELECT * FROM ITEM';
        let listI = [];
        try{
        let items= await db.get(sql,[],true);
        for(let x of items){
            listI = listI.concat(new Item(x.ID,x.DESCRIPTION,x.PRICE,x.SKUID,x.SUPPLIERID));
        }
        return listI;
        }

        catch(err){throw err;}
       
}

async getStoreItembyID(db, id, supplierId) {
    const sql = 'SELECT * FROM ITEM WHERE ID = ? AND SUPPLIERID = ?';
    try{
    let x= await db.get(sql,[id, supplierId],false);
    console.log(x)
    if (x === undefined) {
        console.log('entra')
        throw  {err: 404};
    }

    let item = new Item(x.ID,x.DESCRIPTION,x.PRICE,x.SKUID,x.SUPPLIERID);
    return item;
    }

    catch(err){
        throw err;
    }
   
}

async storeItem(data,db) {
    
    try{
     if(data.id<0){
        throw{err:404};
    } 
    if(data.price<0 || data.supplierId <0){
        throw {err: 422};

    }}
    catch(err){
        throw err;
    }
    
    //TEST IF SKU EXISTS
    try{
        await SKU.getSKUById(db,data.SKUId)
    }
    catch(err){
        throw {err: 404};
    }


    //TEST IF SUPPLIER ALREADY SELLS AN ITEM WITH THE SAME ID
    const sql3 ='SELECT ID FROM ITEM WHERE SUPPLIERID = ?'

    try{
        let x= await db.get(sql3,[data.supplierId],true);

        for(let s of x){
            if(s.ID === data.id){throw {err:422}};
        }
    }
    catch(err){
        throw err;
    }
    //PRIMARY KEY

    //OR SKUID

    const sql2 = 'SELECT SKUID FROM ITEM WHERE SUPPLIERID = ?';

    try{
        let x= await db.get(sql2,[data.supplierId],true);

        for(let s of x){
            if(s.SKUID === data.SKUId){
                throw {err : 422}};
        }
    }
    catch(err){
        throw err;
    }    


        
    const sql = 'INSERT INTO ITEM(ID,DESCRIPTION,PRICE,SKUID,SUPPLIERID) VALUES(?,?,?,?,?)';
    try{
       return await db.query(sql, [data.id,data.description, data.price, data.SKUId, data.supplierId]);
    }
    catch(err)
    {
        throw err;
    }
}

async updateItem(db, data) {

    //check if item exists

    try{
        await this.getStoreItembyID(db, data.id, data.supplierId)
      }
      catch(err){
        throw {err:404};
      }
    
   
    const sql = 'UPDATE ITEM SET DESCRIPTION = ?, PRICE = ? WHERE ID = ? AND SUPPLIERID = ?';
    try{
       await db.query(sql, [data.newDescription, data.newPrice, data.id, data.supplierId]);
    }
    catch(err)
    {
        throw err;
        }
}


async deleteItem(db, id, supplierId) {
    

    const sql = 'DELETE FROM ITEM WHERE ID = ? AND SUPPLIERID = ?';
    try{
       await db.query(sql, [id, supplierId]);
    }
    catch(err)
    {
       throw err;
    }
}

    async resetTable(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS ITEM');
            res = await db.query('CREATE TABLE "ITEM" ( "ID" INTEGER NOT NULL, "DESCRIPTION" TEXT NOT NULL, "PRICE" INTEGER NOT NULL, "SKUID" INTEGER NOT NULL, "SUPPLIERID" INTEGER NOT NULL, PRIMARY KEY("ID","SUPPLIERID") );')
        } catch (err) {
            throw err;
        }

    }

}
module.exports = Icontroller;