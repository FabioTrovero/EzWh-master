'use strict'
const Controller = require('../controller/ItemController');
const Item = require('../classes/item');
const DB = require('../database/EzWh_Database.js');
//const { expect } = require('chai');

const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();

//test definition

describe('test get All Item',()=>{
    let itemList = [];
    let data  =  {
        id : 1,
        description : "item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    }
    
    itemList.push(new Item(data.id,data.description,data.price,data.SKUId,data.supplierId));
    let data1  =  {
        id : 2,
        description : "a new item",
        price : 10.99,
        SKUId : 2,
        supplierId : 2
    }
    itemList.push(new Item(data1.id,data1.description,data1.price,data1.SKUId,data1.supplierId));

    beforeAll(async () =>{
        await dao.resetTable(db);
        await dao.storeItem(data,db);
        await dao.storeItem(data1,db);
    })

    console.log(itemList);

    testItem(itemList);


    function testItem(itemList){

        test('get All Item', async()=>{
            let res = await dao.getStoreItem(db);

            expect(res.length).toStrictEqual(itemList.length);

            for(let i in res){
                compareItem(res[i],itemList[i]);
            }
        })

    }
    })

    describe('test get Item by ID',()=>{
        let data  =  {
            id : 1,
            description : "item",
            price : 10.99,
            SKUId : 1,
            supplierId : 2
        }
        
        let itemList=(new Item(data.id,data.description,data.price,data.SKUId,data.supplierId));
        
        beforeAll(async () =>{
            await dao.resetTable(db);
            await dao.storeItem(data,db);
        })
    
        console.log(itemList);
    
        testItem(itemList);
    
    
        function testItem(itemList){
    
            test('get  Item', async()=>{
                let res = await dao.getStoreItembyID(db,1,2);    
                compareItem(res,itemList);
            })
    
        }
        })

        describe('test ADD Item ',()=>{
            let data  =  {
                id : 1,
                description : "item",
                price : 10.99,
                SKUId : 1,
                supplierId : 2
            }
                        
            beforeEach(async () =>{
                await dao.resetTable(db);

            })
        
            testAddItem('add Item',data,1);
            
            data  =  {
                id : -1,
                description : "item",
                price : 10.99,
                SKUId : 4,
                supplierId : 2
            }
            
            
            testADDItemErrors('negative id',data,{err:404});
            data  =  {
                id : 2,
                description : "item",
                price : -10.99,
                SKUId : 5,
                supplierId : 2
            }
            testADDItemErrors('negative price',data,{err: 422});
            data  =  {
                id : 3,
                description : "item",
                price : 10.99,
                SKUId : 6,
                supplierId : -2
            }
            testADDItemErrors('negative supplierId',data,{err: 422});
            
            function testAddItem(testMessage,data, expectedResult) {
                test(testMessage, async () => {
                    let result = await dao.storeItem(data,db);
                    expect(result).toBe(expectedResult);
                })
            }
            function testADDItemErrors(testMessage,d,expectedError){
                test(testMessage, async () => {
                    async function invalidItem(){
                       await dao.storeItem(d,db);
                    }
                    await expect(invalidItem).rejects.toEqual(expectedError);
                })
            }

            })
    
    
        describe('test get Item by ID,Item no existing',()=>{
            let data  =  {
                id : 1,
                description : "item",
                price : 10.99,
                SKUId : 1,
                supplierId : 2
            }
                    
            beforeAll(async () =>{
                await dao.resetTable(db);
            })
            
            testItemNotExist('Items not existing',data.id, data.supplierId,{err:404});
        
            })
    





        describe('test Update Item by ID',()=>{
            let data  =  {
                id : 1,
                description : "item",
                price : 10.99,
                SKUId : 1,
                supplierId : 2
            }

            let update ={
                newDescription : 'a new sku',
                newPrice : 10.99,
                id : 1,
                supplierId: 2
            }
            
            
            let itemU=(new Item(data.id,update.newDescription,update.newPrice,data.SKUId,data.supplierId));
            
            beforeAll(async () =>{
                await dao.resetTable(db);
                await dao.storeItem(data,db);
                await dao.updateItem(db,update);

            })
        
        
            testItem(itemU);
        
        
            function testItem(item){
        
                test('update Item', async()=>{
                    let res = await dao.getStoreItembyID(db,1,2);    
                    compareItem(res,item);
                })
        
            }
            })


            describe('test store Item by ID, SKU not found',()=>{
                let data  =  {
                    id : 1,
                    description : "item",
                    price : 10.99,
                    SKUId : 100,
                    supplierId : 2
                }
                                
                beforeAll(async () =>{
                    await dao.resetTable(db);
                    //reset skuTable 
                })
            
            
                testSKUnotExist('SKU NOT EXISTS',data,{err: 404});
                })
        

                describe('test store Item by ID, Supplier already sells an item with the same ID',()=>{
                    let data  =  {
                        id : 1,
                        description : "item",
                        price : 10.99,
                        SKUId : 1,
                        supplierId : 2
                    }
                    
                    let data1  =  {
                        id : 1,
                        description : "a new item",
                        price : 10.99,
                        SKUId : 2,
                        supplierId : 2
                    }

                    beforeAll(async () =>{
                        await dao.resetTable(db);
                        await dao.storeItem(data,db);
                    })
                
                    testSKUnotExist('Supplier already sells an item with thew same ID',data1,{err: 422});
                    })

                    describe('test store Item by ID, Supplier already sells an item with the same SKUId',()=>{
                        let data  =  {
                            id : 1,
                            description : "item",
                            price : 10.99,
                            SKUId : 1,
                            supplierId : 2
                        }
                        
                        let data1  =  {
                            id : 2,
                            description : "a new item",
                            price : 10.99,
                            SKUId : 1,
                            supplierId : 2
                        }
    
                        beforeAll(async () =>{
                            await dao.resetTable(db);
                            await dao.storeItem(data,db);
                        })
                    
                        testSKUnotExist('Supplier already sells an item with thew same SKUID',data1,{err: 422});
                        })
                
            
    
            
        


    function compareItem(item, itemList){
        expect(item.ID).toStrictEqual(itemList.ID);
        expect(item.description).toStrictEqual(itemList.description);
        expect(item.price).toStrictEqual(itemList.price);
        expect(item.SKUId).toStrictEqual(itemList.SKUId);
        expect(item.supplierId).toStrictEqual(itemList.supplierId);
        };

        function testSKUnotExist(testMessage,data, expectedError) {
            test(testMessage, async () => {
                async function invalidSKU(){
                   await dao.storeItem(data,db);
                }
                await expect(invalidSKU).rejects.toEqual(expectedError);
            })
        }


        function testItemNotExist(testMessage,id, supplierId, expectedError) {
            test(testMessage, async () => {
                async function invalidItem(){
                   return await dao.getStoreItembyID(db,id, supplierId);
                }
                await expect(invalidItem).rejects.toEqual(expectedError);
            })
        }

        function testADDItemErrors(testMessage,data,expectedError){
            test(testMessage, async () => {
                async function invalidItem(){
                   console.log(await dao.storeItem(db,data));
                }
                await expect(invalidItem).rejects.toEqual(expectedError);
            })
        }