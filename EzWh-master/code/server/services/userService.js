'use strict'

class userService{
    constructor(dao){this.dao = dao};

    getAllUser = async(db) =>{//non usata
        try{
            let us = await this.dao.getStoredUsers(db);
           
            us = us.map((r) => (
                {   id : r.id,
                    name : r.name,
                    surname : r.surname,
                    email: r.username
                }
            ));
            
            return us;
        }
        catch(err){console.log(err);
            throw err;}
    }
    
    getUser = async(db,id) =>{
        try{
            let r = await this.dao.getUserById(db,id);
           
            let us =  (
                {   id : r.id,
                    name : r.name,
                    surname : r.surname,
                    username: r.username,
                    type:r.type
                }
            );
            
            return us;
        }
        catch(err){console.log(err);
            throw err;}
    }



    getSuppliers = async(db) =>{
        try{
            let us = await this.dao.getSupllierUsers(db);
           
            us = us.map((r) => (
                {   id : r.id,
                    name : r.name,
                    surname : r.surname,
                    email: r.username
                }
            ));
            
            return us;
        }
        catch(err){console.log(err);
            throw err;}
    }
    

    
    getUsersNoManager = async(db) =>{
        try{
            let us = await this.dao.getStoredUsersNoManager(db);
            us = us.map((r) => (
                {   id : r.id,
                    name : r.name,
                    surname : r.surname,
                    email: r.username,
                    type:r.type
                }
            ));
            
            return us;
        }
        catch(err){console.log(err);
            throw err;}
    }
    login=async(db,username,pwd,type)=>{
        try{
            let us= await this.dao.checkLogin(db,username,pwd,type)
           
            let res= 
                {
                    id: us.ID,
                    name: us.NAME,
                    username: username,
                }
                console.log(res);
            return res;

        }catch(err){
            throw err;
        }

    }

    store= async(db,data) =>{
        try{
            await this.dao.storeUser(db,data);
        }
        catch(err){throw err;}

    }

    update= async(db,id,data) =>{
        try{
            await this.dao.updateUser(db,id,data);
        }
        catch(err){throw err;}
    }

    delete= async(db,username,type) =>{
        try{
            await this.dao.deleteUser(db,username,type);
        }
        catch(err){throw err;}
    }

}
module.exports = userService;