'use strict'
const Controller = require('../controller/SKUItemController');
const skuserv = require('../services/SKUService')
const skuController = require('../controller/SKUController');
const DB = require('../database/EzWh_Database.js');

//const { expect } = require('chai');
const dao1 = new skuController();
const sku = new skuserv(dao1);
const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();

describe('Persistence Tests', () => {

    let sku1 = (       
        {
            description : "a product",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }
    )


    let sku2 =({
            description : "another product",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : 10.99,
            availableQuantity : 50
        })
    let data = (       
        {
            RFID:"12345678901234567890123456789014",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
    })
    let dataerr = (       
        {
            RFID:"12345678901234567890123456789014",
            SKUId:5,
            DateOfStock:"2021/11/29 12:30"
    }

    )
    let data1 = (       
        {
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
    }

    )
    

        beforeEach(async () => {
        await db.startConnection();
        await dao1.resetTable(db);
        await sku.create(db,sku1);
        await sku.create(db,sku2);

        await dao.resetTable(db);
        

    });
    
    //test 
    

            test('Get all SKUItems', async () => {
                await dao.createSKUItem(db,data);
                await dao.createSKUItem(db,data1);

                
                
                let res = await dao.getSKUItems(db)

                expect(res).toEqual([
                    {
                        RFID: "12345678901234567890123456789014",
                        SKUID: 1,
                        AVAILABLE: 0,
                        DATE: "2021/11/29 12:30"
                    },
                    {
                        RFID: "12345678901234567890123456789015",
                        SKUID: 1,
                        AVAILABLE: 0,
                        DATE: "2021/11/29 12:30"
                    }
                    
                    
                ]);
                await dao.deleteSKUItem(db,'12345678901234567890123456789015');
                res = await dao.getSKUItems(db)
                 expect(res).toEqual([
                    {
                        RFID: "12345678901234567890123456789014",
                        SKUID: 1,
                        AVAILABLE: 0,
                        DATE: "2021/11/29 12:30"
                    }
                ]
                );  
                });

                test('Get SKUItems by RFID', async () => {
                    await dao.createSKUItem(db,data);
                    await dao.createSKUItem(db,data1);
    
                    
                    
                    let res = await dao.getSKUItemByRFID(db,'12345678901234567890123456789014')
    
                    expect(res).toEqual(
                        {
                            RFID: "12345678901234567890123456789014",
                            SKUID: 1,
                            AVAILABLE: 0,
                            DATE: "2021/11/29 12:30"
                        }
                        
                        
                    );
                    });
                    test('ADD SKUItems, wrong SKUId', async () => {
                        
                        async function invalid(){
                            return await dao.createSKUItem(db,dataerr);
                         }
        
                        expect(invalid).rejects.toEqual({err:404});
                        });

                        test('Get all SKUItems available', async () => {
                            await dao.createSKUItem(db,data);
                            await dao.createSKUItem(db,data1);
                            let mod = (       
                                {
                                    RFID:"12345678901234567890123456789014",
                                    Available:1,
                                    DateOfStock:"2021/11/29 12:30"
                            })
                            await dao.modifySKUItem(db,mod,'12345678901234567890123456789014')
                            
                            let res = await dao.getAvailableSKUItemsBySKUId(db,1)
            
                            expect(res).toEqual([
                                {
                                    RFID: "12345678901234567890123456789014",
                                    SKUID: 1,
                                    AVAILABLE: 1,
                                    DATE: "2021/11/29 12:30"
                                }
                            ]);
                            
                        });

                        test('modify SKUItems, wrong SKUId', async () => {
                        
                            async function invalid(){
                                return await dao.modifySKUItem(db,data,1);
                             }
            
                            expect(invalid).rejects.toEqual({err:404});
                            });

                        test('End Connection Error', async () => {
                            db.endConnection();
                            await expect(dao.getSKUItems(db)).rejects.toEqual({err:500});
                        

                            });
        });