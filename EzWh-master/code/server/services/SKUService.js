'use strict'


class SKUService {
    constructor(dao) {this.dao = dao};

    getAllSKUs = async(db) => {
        let result = [];
        try {
            let io = await this.dao.getSKUs(db);
            for (let e of io) {
                if(e.POSITIONID == null){
                    result = result.concat(
                        {
                            id: e.ID,
                            description: e.DESCRIPTION,
                            weight: e.WEIGHT,
                            volume: e.VOLUME,
                            notes: e.NOTES,
                            position: "",
                            availableQuantity: e.QUANTITY,
                            price: e.PRICE,
                            testDescriptors: e.testDescriptors
                        }
                    )

                }
                else{

                    result = result.concat(
                        {
                            id: e.ID,
                            description: e.DESCRIPTION,
                            weight: e.WEIGHT,
                            volume: e.VOLUME,
                            notes: e.NOTES,
                            position: e.POSITIONID,
                            availableQuantity: e.QUANTITY,
                            price: e.PRICE,
                            testDescriptors: e.testDescriptors
                        }
                    )
                }
            }
            return result;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    getSKUByIdServ = async(db, id) => {
        let result = []
        try {
            let e = await this.dao.getSKUById(db, id);
            if(e.POSITIONID == null){
                result = (
                    {
                        description: e.DESCRIPTION,
                        weight: e.WEIGHT,
                        volume: e.VOLUME,
                        notes: e.NOTES,
                        position: "",
                        availableQuantity: e.QUANTITY,
                        price: e.PRICE,
                        testDescriptors: e.testDescriptors
                    }
                )
            }
            else{
                result = (
                    {
                        description: e.DESCRIPTION,
                        weight: e.WEIGHT,
                        volume: e.VOLUME,
                        notes: e.NOTES,
                        position: e.POSITIONID,
                        availableQuantity: e.QUANTITY,
                        price: e.PRICE,
                        testDescriptors: e.testDescriptors
                    }
                )

            }
            return result
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    create = async(db, sku) => {
        try {
            await this.dao.createSKU(db, sku);
        }
        catch(err){throw err;}

    }

    modify = async(db, sku, id) => {
        try {
            await this.dao.modifySKU(db,sku,id);
        }
        catch(err){throw err;}
    }

    modifyPosition = async(db, sku, id) => {
        try {
            await this.dao.modifySKUPosition(db, sku, id);
        }
        catch(err){throw err;}
    }

    delete = async(db, id) => {
        try {
            await this.dao.deleteSKU(db, id);
        }
        catch(err){throw err;}
    }
}
module.exports = SKUService