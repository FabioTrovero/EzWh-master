'use strict'
const dao = require('../mockDB/mockSKUItemcontroller');
const Service = require('../services/SKUItemService');
//const { expect } = require('chai');

const serv = new Service(dao)
describe('test DTO by RFID',() =>{
    let List= ({
        RFID: "12345678901234567890123456789014",
        SKUID: 1,
        AVAILABLE: 1,
        DATE: "2021/11/29 12:30"
    });
    

    
    beforeEach(()=>{
        dao.createSKUItem.mockReset();
        dao.getSKUItemByRFID.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getItemByRFID(undefined,12345678901234567890123456789014);

        expect(res).toEqual( 
            
                {
                    RFID:"12345678901234567890123456789014",
                    SKUId:1,
                    Available:1,
                    DateOfStock:"2021/11/29 12:30",
        
                },
    );
    })
})

describe('test DTO All',() =>{
    let List= [];
    List.push({
        RFID: "12345678901234567890123456789014",
        SKUID: 1,
        AVAILABLE: 1,
        DATE: "2021/11/29 12:30"
    });
    List.push({
        RFID: "12345678901234567890123456789015",
        SKUID: 1,
        AVAILABLE: 0,
        DATE: "2021/11/29 12:30"
    })


    
    beforeEach(()=>{
        dao.createSKUItem.mockReset();
        dao.getSKUItems.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getAllSKUItems(undefined);

        expect(res.length).toStrictEqual(List.length);
        expect(res).toEqual( 
            [
                {
                    RFID:"12345678901234567890123456789014",
                    SKUId:1,
                    Available:1,
                    DateOfStock:"2021/11/29 12:30",
        
                },
                {
                    RFID:"12345678901234567890123456789015",
                    SKUId:1,
                    Available:0,
                    DateOfStock:"2021/11/29 12:30",
                },

            ]
        
               
    );
    })
})
describe('test DTO Availble by SKUId',() =>{
    let List= [({
        RFID: "12345678901234567890123456789014",
        SKUID: 1,
        AVAILABLE: 1,
        DATE: "2021/11/29 12:30"
    })];
    

    
    beforeEach(()=>{
        dao.createSKUItem.mockReset();
        dao.getAvailableSKUItemsBySKUId.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getAvailableSKUItemsBySKUIdServ(undefined,1);

        expect(res).toEqual( 
            [
                {
                    RFID:"12345678901234567890123456789014",
                    SKUId:1,
                    DateOfStock:"2021/11/29 12:30",
        
                },]
    );
    })
})

