'use strict'


class returnOrderService{
    constructor(dao){this.dao = dao};
    getAllretO = async(db) =>{
        let result = []; 
        try{
            let io = await this.dao.getReturnOrder(db);
            for(let row of io){
                result = result.concat(
                    {
                        id: row.ID,
                        returnDate : row.returnDate,
                        products: row.products.map((e)=>(
                            {
                            SKUId: e.SKUID,itemId:e.ITEMID,description: e.description,price: e.price, RFID: e.RFID

                            }
                            )),
                        restockOrderId : row.restockOrderId
                    }
                )
            }
            return result;

        }
        catch(err){console.log(err);
            throw err;}
    }

    getRetObyId = async(db,id) =>{
        let result = []; 
        try{
            let row = await this.dao.getReturnOrderbyID(db,id);
            result =(
                {
                    id: row.ID,
                    returnDate : row.returnDate,
                    products: row.products.map((e)=>(
                        {
                            SKUId: e.SKUID,itemId:e.ITEMID,description: e.description,price: e.price, RFID: e.RFID

                        }
                        )),
                    restockOrderId : row.restockOrderId
                }
            )
            return result;

        }
        catch(err){console.log(err);
            throw err;}
    }

    
    store= async(data,db) =>{
        try{
            await this.dao.storeReturnOrder(data,db);
        }
        catch(err){throw err;}

    }

    delete= async(db,id) =>{
        try{
            await this.dao.deleteReturnOrderbyId(db,id);
        }
        catch(err){throw err;}
    }

}
module.exports = returnOrderService;