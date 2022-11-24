'use strict'
const Controller = require('../controller/testDescriptorController');
const DB = require('../database/EzWh_Database.js');

const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();


describe('test get All TestDescriptors',()=>{
    let tdList = [];
    let data  =  {
        ID:1,
        name : "test 1",
        procedureDescription : "test of an item",
        idSKU : 1,
    }
    
    tdList.push(data);
    let data1  =  {
        ID:2,
        name : "test 2",
        procedureDescription : "test of an item 2",
        idSKU : 3,
    }
    tdList.push(data1);

    beforeAll(async () =>{
        await dao.resetTableTestDescriptor(db);
        await dao.storeTestDescriptor(db,data);
        await dao.storeTestDescriptor(db,data1);
    })
    testTestDescriptor(tdList);


    function testTestDescriptor(tdList){

        test('test get All TestDescriptors', async()=>{
            let res = await dao.getStoreTestDescriptors(db);

            expect(res.length).toStrictEqual(tdList.length);

            for(let i=0;i<tdList.length;i++){
                compareTestDescriptor(res[i],tdList[i]);
            }
        })

    }
    })

    describe('test get TestDescriptor by ID',()=>{
        let data  =  {
            ID:1,
            name : "test 1",
            procedureDescription : "test of an item",
            idSKU : 1,
        }
        
        
        
        beforeAll(async () =>{
            await dao.resetTableTestDescriptor(db);
            await dao.storeTestDescriptor(db,data);
        })
    
        testTestDescriptor(data);
    
    
        function testTestDescriptor(tdList){
    
            test('test get TestDescriptor by ID', async()=>{
                let res = await dao.getTestDescriptorByID(db,1);    
                compareTestDescriptor(res,tdList);
            })
    
        }
        })


        describe('test Update TestDescriptor by ID',()=>{
            let data  =  {
                ID:1,
                name : "test 1",
                procedureDescription : "test of an item",
                idSKU : 1,
            }

            let update ={
                newName : "test 1",
                newProcedureDescription : "test of an item",
                newIdSKU : 1,
            }
            
            
            beforeAll(async () =>{
            await dao.resetTableTestDescriptor(db);
            await dao.storeTestDescriptor(db,data);
            await dao.updateTestDescriptor(db,1,update);

            })
        
        
            testTestDescriptor(data);
        
        
            function testTestDescriptor(td){
        
                test('update TestDescriptor', async()=>{
                    let res = await dao.getTestDescriptorByID(db,1);    
                    compareTestDescriptor(res,td);
                })
        
            }
            })
            
            describe('Delete test Descriptor',()=>{
                let data  =  {
                    ID:1,
                    name : "test 1",
                    procedureDescription : "test of an item",
                    idSKU : 1,
                }
                
                
                
                beforeAll(async () =>{
                    await dao.resetTableTestDescriptor(db);
                    await dao.storeTestDescriptor(db,data);
                })
            
                testTestDescriptor(data);
            
            
                function testTestDescriptor(tdList){
            
                    test('Delete test Descriptor', async()=>{
                        await dao.deleteTestDescriptor(db,1);
                        let yo = await dao.getStoreTestDescriptors(db);    
                        expect(yo).toStrictEqual([])
                    })
            
                }
                })


        function compareTestDescriptor(td, tdList){
            expect(td.ID).toStrictEqual(tdList.ID);
            expect(td.description).toStrictEqual(tdList.procedureDescription);
            expect(td.name).toStrictEqual(tdList.name);
            expect(td.SKUId).toStrictEqual(tdList.idSKU);
            };

            