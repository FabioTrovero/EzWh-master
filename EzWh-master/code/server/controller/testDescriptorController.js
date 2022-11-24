'use strict'
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
const TestDescriptor = require('../classes/testDescriptor');


class TDcontroller{

    constructor(){}
    
    async storeTestDescriptor(db,data) {
        
            const sql = 'INSERT INTO TESTDESCRIPTOR( NAME, DESCRIPTION,SKUID) VALUES(?,?,?)';
            try{
               await db.query(sql, [data.name, data.procedureDescription, data.idSKU]);
            }
            catch(err)
            {
                console.log(err);
            }
    }

    async getStoreTestDescriptors(db) {
            const sql = 'SELECT * FROM TESTDESCRIPTOR';
            let td;
            let listTd=[];
            try{
            td= await db.get(sql,[],true);
            for(let x of td){
                listTd = listTd.concat(new TestDescriptor(x.ID,x.NAME,x.DESCRIPTION,x.SKUID));
            }
            return listTd;
            }
                catch(err){console.log(err);}
           
    }

    async getTestDescriptorByID(db,id){
        const sql = 'SELECT * FROM TESTDESCRIPTOR  WHERE ID = ? ';
        let td;
        
        try{
            td= await db.get(sql,[id],false);
            if(td == undefined){
                throw{err: 404};
            }
            let ret = new TestDescriptor(td.ID,td.NAME,td.DESCRIPTION,td.SKUID);
            return ret;
            }catch(err)
            {console.log(err)
                throw err;
            
        }          
            
    }

    async updateTestDescriptor(db,id,newtd) {
        const sql = 'UPDATE TESTDESCRIPTOR SET NAME=?,DESCRIPTION=?,SKUID=? WHERE ID=?';
        try{
        await db.query(sql,[newtd.newName,newtd.newProcedureDescription,newtd.newIdSKU,id]);
            }
            catch(err){
                console.log(err);
                throw err;
            }
       
    }


    async deleteTestDescriptor(db,id){
        const sql = 'DELETE FROM TESTDESCRIPTOR WHERE ID = ?';
        try{
            await db.query(sql,[id]);
         }
         catch(err)
         {
             console.log(err);
         }
    }

    async resetTableTestDescriptor(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS TESTDESCRIPTOR');
            res=await db.query('CREATE TABLE "TESTDESCRIPTOR" ( "ID"	INTEGER NOT NULL,"NAME"	TEXT NOT NULL,"DESCRIPTION"	TEXT NOT NULL, "SKUID"	INTEGER NOT NULL, PRIMARY KEY("ID" AUTOINCREMENT) )');
        } catch (err) {
            throw err;
        }

    }



}

module.exports = TDcontroller;