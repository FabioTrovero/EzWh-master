'use strict';


class SKUItemService {
    constructor(dao) {this.dao = dao};

    getAllSKUItems = async(db) => {
        let result = [];
        try {
            let io = await this.dao.getSKUItems(db);
            for (let e of io) {
                result = result.concat(
                    {
                        RFID: e.RFID,
                        SKUId: e.SKUID,
                        Available: e.AVAILABLE,
                        DateOfStock: e.DATE
                    }
                )
            }
            return result;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    getAvailableSKUItemsBySKUIdServ = async(db, skuid) => {
        let result = []
        try {
            let io = await this.dao.getAvailableSKUItemsBySKUId(db, skuid);
            for (let e of io) {
                result = result.concat(
                    {
                        RFID: e.RFID,
                        SKUId: e.SKUID,
                        DateOfStock: e.DATE
                    }
                )
            }
            return result;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    getItemByRFID = async(db, rfid) => {
        let result = []
        try {
            let io = await this.dao.getSKUItemByRFID(db, rfid);
            result = (
                {
                    RFID: io.RFID,
                    SKUId: io.SKUID,
                    Available: io.AVAILABLE,
                    DateOfStock: io.DATE
                }
            )
            return result;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    }

    create = async(db, data) => {
        try {
            await this.dao.createSKUItem(db, data);
        }
        catch(err){throw err;}

    }

    modify = async(db, data, rfid) => {
        try {
            await this.dao.modifySKUItem(db, data, rfid);
        }
        catch(err){throw err;}

    }

    delete = async(db, rfid) => {
        try {
            await this.dao.deleteSKUItem(db, rfid);
        }
        catch(err){throw err;}

    }
}
module.exports = SKUItemService;