'use strict'
const dao = require('../mockDB/mockPositionController');
const pService = require('../services/positionService');
//const { expect } = require('chai');

const serv = new pService(dao)
describe('test DTO',() =>{
    let List= [];
    List.push({
        ID :"800234543412",
        ISLE : "8002",
        ROW : "3454",
        COL : "3412",
        MAXWEIGHT: 1000,
        MAXVOLUME : 1000,
        OCCUPIEDWEIGHT : 300,
        OCCUPIEDVOLUME: 150,

    });
    List.push({
        ID :"800234543413",
        ISLE : "8002",
        ROW : "3454",
        COL : "3413",
        MAXWEIGHT: 1000,
        MAXVOLUME : 1000,
        OCCUPIEDWEIGHT : 0,
        OCCUPIEDVOLUME: 0,

    })


    
    beforeEach(()=>{
        dao.createPosition.mockReset();
        dao.getPositions.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getAllPositions(undefined);

        expect(res.length).toStrictEqual(List.length);
        expect(res).toEqual( 
            [
                {
                    positionID:"800234543412",
                    aisleID: "8002",
                    row: "3454",
                    col: "3412",
                    maxWeight: 1000,
                    maxVolume: 1000,
                    occupiedWeight: 300,
                    occupiedVolume:150
                },
                {
                    positionID:"800234543413",
                    aisleID: "8002",
                    row: "3454",
                    col: "3413",
                    maxWeight: 1000,
                    maxVolume: 1000,
                    occupiedWeight: 0,
                    occupiedVolume:0
                },

            ]
        
               
    );
    })
})
describe('test modify',() =>{

    beforeEach(()=>{
        dao.createPosition.mockReset();
        dao.modifyPosition.mockReturnValueOnce(undefined);
    })

    test('get All ',async() => {
        
        let res= await serv.modify(undefined,undefined,"800234543412");

        expect(res).toEqual( 
            undefined
        
               
    );
    })
})

describe('test modify modifyPositionId',() =>{

    beforeEach(()=>{
        dao.createPosition.mockReset();
        dao.modifyPosition.mockReturnValueOnce(undefined);
    })

    test('get All ',async() => {
        
        let res= await serv.modify(undefined,undefined,"800234543412");

        expect(res).toEqual( 
            undefined
        
               
    );
    })
})

