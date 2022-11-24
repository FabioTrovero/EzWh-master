'use strict'
const sqlite = require('sqlite3');
const DB = require('../database/EzWh_Database');
var bcrypt = require('bcryptjs');// per hashing password
const User =require('../classes/user');

const verifyHash = async (plainText, hashAndSalt) => {
    const ok = await bcrypt.compare(plainText, hashAndSalt);

    return ok
};




class Ucontroller {

    constructor() { }

    async storeUser(db, data) {

        const sql = 'INSERT INTO USER(USERNAME,NAME, SURNAME,PASSWORD,TYPE) VALUES(?,?,?,?,?)';
        const sql2 = 'SELECT * FROM USER  WHERE USERNAME=? AND TYPE=?';


        var salt = bcrypt.genSaltSync(10);
        var pwd = bcrypt.hashSync(data.password, salt);

        let names;

        try {

            names = await db.get(sql2, [data.username, data.type], true);
           
            if (names.length > 0) {
                throw { err: 409 }
            }
        } catch (err) {
            throw err
        }

        try {

            await db.query(sql, [data.username, data.name, data.surname, pwd, data.type]);
        }
        catch (err) {

            throw { err: 503 };
        }
    }

    /*async getStoredUsers(db) {//non usata
        const sql = 'SELECT ID,NAME,SURNAME,USERNAME,TYPE FROM USER';
        let uList=[];
        try {
            let names = await db.get(sql, [], true);
            for(let x of names){
                uList=uList.concat(new User(x.ID,x.USERNAME,x.NAME,x.SURNAME,null,x.TYPE))
            }
            return uList;
        }
        catch (err) { console.log(err); }

    }*/

    async getSupllierUsers(db) {
        const sql = 'SELECT ID,NAME,SURNAME,USERNAME FROM USER WHERE TYPE="supplier"';
        let uList=[];
        try {
            let names = await db.get(sql, [], true);
            for(let x of names){
                uList=uList.concat(new User(x.ID,x.USERNAME,x.NAME,x.SURNAME,null,x.TYPE))
            }
            
            return uList;
        }
        catch (err) { console.log(err); }
    }

    async getStoredUsersNoManager(db) {
        const sql = 'SELECT ID,NAME,SURNAME,USERNAME,TYPE FROM USER WHERE TYPE<>"manager"';
        let uList=[];
        try {
            let names = await db.get(sql, [], true);
            for(let x of names){
                uList=uList.concat(new User(x.ID,x.USERNAME,x.NAME,x.SURNAME,null,x.TYPE))
            }
            return uList;
        }
        catch (err) { console.log(err); }

    }

    async checkLogin(db, username, pwd, type) {
        const sql = 'SELECT ID,NAME,PASSWORD FROM USER WHERE USERNAME=? AND TYPE=?';

        try {
            let names = await db.get(sql, [username, type], false);
            if (bcrypt.compareSync(pwd, names.PASSWORD)) {
                return names;
            } else {
                throw { err: 404 }
            }


        } catch (err) { console.log(err); }

    }

    async getUserById(db, id) {
        const sql = 'SELECT ID,NAME,SURNAME,USERNAME,TYPE FROM USER WHERE ID=?';
        try {
            let x = await db.get(sql, [id], false);
            let us=new User(x.ID,x.USERNAME,x.NAME,x.SURNAME,null,x.TYPE)
            return us;
        }
        catch (err) { console.log(err); }

    }

    async updateUser(db, username, newUser) {
        const sql = 'UPDATE USER SET TYPE=? WHERE USERNAME=? AND TYPE=?';
        const sql2 = 'SELECT * FROM USER  WHERE USERNAME=? AND TYPE=?';
        let a;
        try {
            a = await db.get(sql2, [username,newUser.oldType], true);
        }
        catch (err) {
            
        }
        if (a.length == 0) {
            throw { err: 404 }
        }
        try {
            
            await db.query(sql, [newUser.newType, username, newUser.oldType]);
        }
        catch (err) {
            ;
        }

    }

    async deleteUser(db, username, type) {
        const sql = 'DELETE FROM USER  WHERE USERNAME=? AND TYPE=?';
        try {
            await db.query(sql, [username, type]);
        }
        catch (err) {
            ;
        }

    }

    async resetTableUser(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS USER');
            res= await db.query('CREATE TABLE "USER" ("ID"	INTEGER NOT NULL,"USERNAME"	INTEGER NOT NULL,"NAME"	INTEGER NOT NULL,"SURNAME"	INTEGER NOT NULL,"PASSWORD"	INTEGER NOT NULL,"TYPE"	INTEGER NOT NULL,PRIMARY KEY("ID" AUTOINCREMENT))');
        } catch (err) {
            throw err;
        }

    }

    async addDefaultUsers(db){
        try {
            let res = await db.query('DROP TABLE IF EXISTS USER');
            res= await db.query('CREATE TABLE "USER" ("ID"	INTEGER NOT NULL,"USERNAME"	INTEGER NOT NULL,"NAME"	INTEGER NOT NULL,"SURNAME"	INTEGER NOT NULL,"PASSWORD"	INTEGER NOT NULL,"TYPE"	INTEGER NOT NULL,PRIMARY KEY("ID" AUTOINCREMENT))');
            await this.storeUser(db,{username:"manager1@ezwh.com",name:"a",surname:"b",password:"testpassword",type:"manager"})
            await this.storeUser(db,{username:"user1@ezwh.com",name:"a",surname:"b",password:"testpassword",type:"customer"})
            await this.storeUser(db,{username:"qualityEmployee1@ezwh.com",name:"a",surname:"b",password:"testpassword",type:"qualityEmployee"})
            await this.storeUser(db,{username:"clerk1@ezwh.com",name:"a",surname:"b",password:"testpassword",type:"clerk"})
            await this.storeUser(db,{username:"deliveryEmployee1@ezwh.com",name:"a",surname:"b",password:"testpassword",type:"deliveryEmployee"})
            await this.storeUser(db,{username:"supplier1@ezwh.com",name:"a",surname:"b",password:"testpassword",type:"supplier"})
        } catch (err) {
            throw err;
        }
    }


}

module.exports = Ucontroller;