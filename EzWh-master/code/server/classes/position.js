'use strict'
class Position {

    constructor (ID, isle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) {
        this.ID = ID;
        this.isle = isle;
        this.row = row;
        this.col = col;
        this.maxWeight = maxWeight;
        this.maxVolume = maxVolume;
        this.occupiedWeight = occupiedWeight;
        this.occupiedVolume = occupiedVolume;
    }
}

module.exports = Position;