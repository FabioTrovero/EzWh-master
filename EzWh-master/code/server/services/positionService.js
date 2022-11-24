'use strict';


class PositionService {
    constructor(dao) {this.dao = dao};

    getAllPositions = async(db) => {
        let result = [];
        try {
            let io = await this.dao.getPositions(db);
            for (let e of io) {
                result = result.concat(
                    {
                        positionID: e.ID,
                        aisleID: e.ISLE,
                        row: e.ROW,
                        col: e.COL,
                        maxWeight: e.MAXWEIGHT,
                        maxVolume: e.MAXVOLUME,
                        occupiedWeight: e.OCCUPIEDWEIGHT,
                        occupiedVolume: e.OCCUPIEDVOLUME
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

    create = async(db, data) => {
        try {
            await this.dao.createPosition(db, data);
        }
        catch(err){throw err;}
    }

    modify = async(db, data, positionID) => {
        try {
            await this.dao.modifyPosition(db, data, positionID);
        }
        catch(err){throw err;}
    }

    modifyPositionId = async(db, data, positionID) => {
        try {
            await this.dao.modifyPositionIDOfPosition(db, data, positionID)
        }
        catch(err){throw err;}
    }

    delete = async(db, positionID) => {
        try {
            await this.dao.deletePosition(db, positionID);
        }
        catch(err){throw err;}
    }

}
module.exports = PositionService;