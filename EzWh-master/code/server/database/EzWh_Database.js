'use strict';

const sqlite = require('sqlite3');
class DB {
    constructor(dbname) {
        this.dbname=dbname;  
    }

    dropTable() {
        return new Promise((resolve, reject)  => {
            const sql = 'DROP TABLE IF EXISTS NAMES';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    startConnection(){
        this.db = new sqlite.Database(this.dbname,(err)=>{if(err) throw err;})
    }
    endConnection() {
        this.db.close((err) => { if (err) throw err; });
    }

    get(query,params,all){
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else
                {
                    if(all===true) resolve(rows);
                    else resolve(rows[0]);
                }
            })
        });
    }
    query(query, params) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err)
                    reject(err);
                else
                    resolve(this.lastID); //lastID return number of inserted rows
            });
        });

    }
}



module.exports = DB;
