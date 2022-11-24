'use strict'
const Controller = require('../controller/SKUController');
const ControllerTn = require('../controller/testDescriptorController')
const posController = require('../controller/positionController')
const DB = require('../database/EzWh_Database.js');

//const { expect } = require('chai');

const pos = new posController();
const dao  = new Controller();
const td = new ControllerTn()
const db = new DB('EzWh.db');

db.startConnection();

describe('Persistence Tests', () => {


    let data = (       
        {
            description : "a product",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }
    )


    let data1 =({
            description : "another product",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : 10.99,
            availableQuantity : 50
        })
        let dataerr =({
            description : "another product",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : -10.99,
            availableQuantity : 50
        })
    let newData = {
        newDescription : "a new sku",
        newWeight : 100,
        newVolume : 50,
        newNotes : "first SKU",
        newPrice : 10.99,
        newAvailableQuantity : 50
    }
    
        
    

        beforeEach(async () => {
        
        await db.startConnection();
        await td.resetTableTestDescriptor(db);
        await pos.resetTable(db);
        await dao.resetTable(db);
        

    });
    
    //test 
    

            test('Get all SKU', async () => {
                await dao.createSKU(db,data);
                await dao.createSKU(db,data1);
                let tn ={
                    name:"test descriptor 3",
                    procedureDescription:"This test is described by...",
                    idSKU :1
                }

                await td.storeTestDescriptor(db,tn)
                
                
                let res = await dao.getSKUs(db)

                

                expect(res).toEqual([
                    {
                        ID :1,
                        DESCRIPTION : 'a product',
                        WEIGHT : 100,
                        VOLUME : 50,
                        PRICE: 10.99,
                        NOTES : 'first SKU',
                        QUANTITY : 50,
                        POSITIONID: null,
                        testDescriptors: [1]

                    },
                    {
                        ID :2,
                        DESCRIPTION : 'another product',
                        WEIGHT : 100,
                        VOLUME : 50,
                        PRICE: 10.99,
                        NOTES : 'second SKU',
                        QUANTITY : 50,
                        POSITIONID: null,
                        testDescriptors: []

                    }
                    
                    
                ]);
                await dao.deleteSKU(db,1);
                res = await dao.getSKUs(db)
                 expect(res).toEqual([
                    {
                        ID :2,
                        DESCRIPTION : 'another product',
                        WEIGHT : 100,
                        VOLUME : 50,
                        PRICE: 10.99,
                        NOTES : 'second SKU',
                        QUANTITY : 50,
                        POSITIONID: null,
                        testDescriptors: []

                    }
                ]
                ); 
                });


                test('Get SKU by Id', async () => {
                    await dao.createSKU(db,data);
                    let tn ={
                        name:"test descriptor 3",
                        procedureDescription:"This test is described by...",
                        idSKU :1
                    }
    
                    await td.storeTestDescriptor(db,tn)
                    
                    
                    let res = await dao.getSKUById(db,1)
    
                    
    
                    expect(res).toEqual(
                        {
                            ID :1,
                            DESCRIPTION : 'a product',
                            WEIGHT : 100,
                            VOLUME : 50,
                            PRICE: 10.99,
                            NOTES : 'first SKU',
                            QUANTITY : 50,
                            POSITIONID: null,
                            testDescriptors: [1]
    
                        }
                        
                    );
                    });

                    test('Get SKU by Id,no ID', async () => {
                        async function invalid(){
                            return await dao.getSKUById(db,1)
                         }
        
                        expect(invalid).rejects.toEqual({err:404});
                        });

                    test('Get store negative price', async () => {
                            async function invalid(){
                                return await dao.createSKU(db,dataerr)
                             }
            
                            expect(invalid).rejects.toEqual({err:422});
                            });




                    test('modify SKU', async () => {
                        await dao.createSKU(db,data);
                        
                        let skud = ({
                            newDescription : "a new sku",
                            newWeight : 100,
                            newVolume : 50,
                            newNotes : "first SKU",
                            newPrice : 10.99,
                            newAvailableQuantity : 50
                        }
                        )
                        await dao.modifySKU(db,skud,1);
                        let res = await dao.getSKUById(db,1)
        
                        
        
                        expect(res).toEqual(
                            {
                                ID :1,
                                DESCRIPTION : 'a new sku',
                                WEIGHT : 100,
                                VOLUME : 50,
                                PRICE: 10.99,
                                NOTES : 'first SKU',
                                QUANTITY : 50,
                                POSITIONID: null,
                                testDescriptors: []
        
                            }
                            
                        );
                        });

                         test('modify SKU, not space available', async () => {
                            await dao.createSKU(db,data);
                            let posdata = ({
                                positionID:"800234523412",
                                aisleID: "8002",
                                row: "3454",
                                col: "3412",
                                maxWeight: 10000,
                                maxVolume: 10000
                            }
                    )
                            await pos.createPosition(db,posdata);
                            let skud1 = ({
                                position: "800234523412"
                            }
                            
                            )
                            await dao.modifySKUPosition(db,skud1,1);
                            let skud = ({
                                newDescription : "a new sku",
                                newWeight : 10000,
                                newVolume : 50,
                                newNotes : "first SKU",
                                newPrice : 10.99,
                                newAvailableQuantity : 50
                            }
                            )
                            

            
                            async function invalid(){
                                return await dao.modifySKU(db,skud,1);
                             }
            
                            expect(invalid).rejects.toEqual({err:422});
                                
                            
                            });
 

                        test('modify position', async () => {
                            await dao.createSKU(db,data);
                            let posdata = ({
                                positionID:"800234523412",
                                aisleID: "8002",
                                row: "3454",
                                col: "3412",
                                maxWeight: 10000,
                                maxVolume: 10000
                            }
                    )
                            await pos.createPosition(db,posdata);
                            let skud = ({
                                position: "800234523412"
                            }
                            
                            )
                            await dao.modifySKUPosition(db,skud,1);
                            let res = await dao.getSKUById(db,1)
            
                            
            
                            expect(res).toEqual(
                                {
                                    ID :1,
                                    DESCRIPTION : 'a product',
                                    WEIGHT : 100,
                                    VOLUME : 50,
                                    PRICE: 10.99,
                                    NOTES : 'first SKU',
                                    QUANTITY : 50,
                                    POSITIONID: 800234523412,
                                    testDescriptors: []
            
                                }
                                
                            );
                            });

                            test('modify position,not space available', async () => {
                                await dao.createSKU(db,data);
                                let posdata = ({
                                    positionID:"800234523412",
                                    aisleID: "8002",
                                    row: "3454",
                                    col: "3412",
                                    maxWeight: 500,
                                    maxVolume: 500
                                }
                        )
                                await pos.createPosition(db,posdata);
                                let skud = ({
                                    position: "800234523412"
                                }
                                
                                )
                                
                                
                                async function invalid(){
                                    return await dao.modifySKUPosition(db,skud,1);
                                 }
                
                                expect(invalid).rejects.toEqual({err:422});

                                });

                
        });