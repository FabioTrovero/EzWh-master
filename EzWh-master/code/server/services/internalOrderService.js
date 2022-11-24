'use strict'


class InternalOrderService{
    constructor(dao){this.dao = dao};
    getAllIntO = async(db) =>{
        let result = []; 
        try{
            let io = await this.dao.getInternalOrder(db);
            for(let r of io){
                if(r.state === 'COMPLETED'){
            result = result.concat(
                {  
                    id : r.ID,
                    issueDate: r.date,
                    state : r.state,
                    products:  r.products.map((e)=>(
                        {
                        SKUId: e.SKUID,description: e.description,price: e.price, RFID: e.RFID

                        })),
                        customerId: r.customerId
                }
                
            );
            }
            else{
                result = result.concat(
                    {  
                        id : r.ID,
                        issueDate: r.date,
                        state : r.state,
                        products: r.products.map((e)=>(
                            {
                            SKUId: e.SKUID,description: e.description,price: e.price, qty: e.quantity
    
                            })),
                            customerId: r.customerId
                    }
                    
                );

            }
            }
            return result;

        }
        catch(err){console.log(err);
            throw err;}
    }

    getIntObyId = async(db,id) =>{
        let result;
        try{
            let r = await this.dao.getInternalOrderbyID(db,id);
            
                if(r.state === 'COMPLETED'){
                result = (
                {  
                    id : r.ID,
                    issueDate: r.date,
                    state : r.state,
                    products:  r.products.map((e)=>(
                        {
                        SKUId: e.SKUID,description: e.description,price: e.price, RFID: e.RFID

                        })),
                        customerId: r.customerId
                }
                
            );
            }
            else{
                result =(
                    {  
                        id : r.ID,
                        issueDate: r.date,
                        state : r.state,
                        products: r.products.map((e)=>(
                            {
                            SKUId: e.SKUID,description: e.description,price: e.price, qty: e.quantity
    
                            })),
                            customerId: r.customerId
                    }
                    
                );

            }
            
            return result;

        }
        catch(err){console.log(err);
            throw err;}
    }

    getAllIntObyState = async(db,state) =>{
        let result = []; 
        try{
            let io = await this.dao.getInternalOrderState(db,state);
            for(let r of io){
                result = result.concat(
                    {  
                        id : r.ID,
                        issueDate: r.date,
                        state : r.state,
                        products: r.products.map((e)=>(
                            {
                            SKUId: e.SKUID,description: e.description,price: e.price, qty: e.quantity
    
                            })),
                            customerId: r.customerId
                    }
                    
                );
            }
            return result;

        }
        catch(err){console.log(err);
            throw err;}
    }


    store= async(data,db) =>{
        try{
            await this.dao.storeInternalOrder(data,db);
        }
        catch(err){throw err;}

    }

    update= async(data,db,id) =>{
        try{
            await this.dao.modifyState(data,db,id);
        }
        catch(err){throw err;}
    }

    delete= async(db,id) =>{
        try{
            await this.dao.deleteInternalOrder(db,id);
        }
        catch(err){throw err;}
    }

}
module.exports = InternalOrderService;