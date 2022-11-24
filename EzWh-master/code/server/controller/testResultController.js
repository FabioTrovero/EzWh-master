'use strict'
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
const TestResult = require('../classes/testResult');

class TRcontroller{

    constructor(){}
    async storeTestResult(db,data) {
        
            const sql = 'INSERT INTO TESTRESULT(RFID, DATE, RESULT,TESTDESCRIPTORID) VALUES(?,?,?,?)';
            try{
               await db.query(sql, [data.rfid,data.Date, data.Result, data.idTestDescriptor]);
            }
            catch(err)
            {
                console.log(err);
            }
    }

    async getStoreTestResults(db) {
            const sql = 'SELECT * FROM TESTRESULT';
            let listTr=[];
            let tr;
            try{
            tr= await db.get(sql,[],true);
            for(let x of tr){
                listTr = listTr.concat(new TestResult(x.ID,x.DATE,x.RESULT,x.TESTDESCRIPTORID,x.RFID));
            }
            return listTr;
        
                }
                catch(err){console.log(err);}
           
    }


    async getTestResultByRFID(db,RFID) {
        const sql = 'SELECT * FROM TESTRESULT WHERE RFID=?';
        try{
        let tr= await db.get(sql,[RFID],true);
        let listTr=[];
        for(let x of tr){
            listTr = listTr.concat(new TestResult(x.ID,x.DATE,x.RESULT,x.TESTDESCRIPTORID,x.RFID));
        }
        return listTr;
        
            }
            catch(err){console.log(err);}
       
    }

    async getTestResultById(db,ID,RFID) {
        const sql = 'SELECT * FROM TESTRESULT WHERE ID=? AND RFID=?';
        let x;
        try{
        x= await db.get(sql,[ID,RFID],false);
        if(x == undefined){
            throw{err: 404};
        }
        let ret=new TestResult(x.ID,x.DATE,x.RESULT,x.TESTDESCRIPTORID,x.RFID)
        return ret;
            }
            catch(err){console.log(err);
            
                throw err;
            }    
    }


    async updateTestResult(db,id,rfid,newtr) {
        const sql = 'UPDATE TESTRESULT SET TESTDESCRIPTORID=?,DATE=?,RESULT=? WHERE ID=? AND RFID=?';
        try{
        await db.query(sql,[newtr.newIdTestDescriptor,newtr.newDate,newtr.newResult,id,rfid]);
            }
            catch(err){
                console.log(err);
            }
       
    }

    async deleteTestResult(db,id,rfid){
        const sql = 'DELETE FROM TESTRESULT WHERE ID = ? AND RFID=?';
        try{
            await db.query(sql,[id,rfid]);
         }
         catch(err)
         {
             console.log(err);
         }
    }

    async resetTableTestResult(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS TESTRESULT');
            res = await db.query('CREATE TABLE "TESTRESULT" ("ID"	INTEGER NOT NULL,"DATE"	TEXT NOT NULL,"RESULT"	INTEGER NOT NULL,"TESTDESCRIPTORID"	INTEGER NOT NULL, "RFID"	TEXT NOT NULL,PRIMARY KEY("ID" AUTOINCREMENT) )')
        } catch (err) {
            throw err;
        }

    }


}

module.exports = TRcontroller;