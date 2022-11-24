'use strict'

class testDescriptorService{
    constructor(dao){this.dao = dao};
    getAllTestDescriptor = async(db) =>{
        try{
            let td = await this.dao.getStoreTestDescriptors(db);
           
            td = td.map((r) => (
                {  
                    id:r.ID,
                    name : r.name,
                    procedureDescription: r.description,
                    idSKU: r.SKUId
                }
            ));
            
            return td;
        }
        catch(err){console.log(err);
            throw err;}
    }

    
    getTestDescriptor = async(db,id) =>{
        try{
            let r = await this.dao.getTestDescriptorByID(db,id);
            let res = (
                {  
                    id:r.ID,
                    name : r.name,
                    procedureDescription: r.description,
                    idSKU: r.SKUId
                }
            );
            
            return res;
        }
        catch(err){console.log(err);
            throw err;}
    }


    store= async(db,data) =>{
        try{
            await this.dao.storeTestDescriptor(db,data);
        }
        catch(err){throw err;}

    }

    update= async(db,id,data) =>{
        try{
            await this.dao.updateTestDescriptor(db,id,data);
        }
        catch(err){throw err;}
    }

    delete= async(db,id) =>{
        try{
            await this.dao.deleteTestDescriptor(db,id);
        }
        catch(err){throw err;}
    }

}
module.exports = testDescriptorService;