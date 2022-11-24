'use strict'


class ItemService{
    constructor(dao){this.dao = dao};

    getAllItem = async(db) =>{
        try{
            let items = await this.dao.getStoreItem(db);
            let result = items.map((r) => (
                {  
                    id : r.ID,
                    description: r.description,
                    price : r.price,
                    SKUId : r.SKUId,
                    supplierId: r.supplierId
                }
                ));
                return result;

        }
        catch(err){
            throw err;}
    }

    getItem = async(db, id, supplierId) =>{
        try{
            let r = await this.dao.getStoreItembyID(db, id, supplierId);
            let result =  (
                {  
                    id : r.ID,
                    description: r.description,
                    price : r.price,
                    SKUId : r.SKUId,
                    supplierId: r.supplierId
                }
            );
            return result;

        }
        catch(err){
            throw err;}

    }

    store= async(db,data) =>{
        try{
            await this.dao.storeItem(data,db);
        }
        catch(err){;throw err;}

    }

    update= async(db,data) =>{
        try{
            await this.dao.updateItem(db,data);
        }
        catch(err){console.log(err);throw err;}
    }

    delete= async(db, id, supplierId) =>{
        try{
            await this.dao.deleteItem(db, id, supplierId);
        }
        catch(err){throw err;}
    }

}
module.exports = ItemService;